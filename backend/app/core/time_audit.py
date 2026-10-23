"""
Time normalization, boundary proximity audit, and time-uncertainty ensemble generator.
Follows Step 2 of Six-Culture Verified Chart specification.
"""

from datetime import datetime, date, time, timedelta, timezone
from zoneinfo import ZoneInfo
import math
import swisseph as swe
from timezonefinder import TimezoneFinder

tf = TimezoneFinder()

def normalize_birth_input(
    birth_date: str,          # "YYYY-MM-DD"
    birth_time: str,          # "HH:MM" (24-hr) or "" if unknown
    latitude: float,
    longitude: float,
    time_certainty: str = "exact",  # "exact", "rounded_15", "approx_30", "unknown"
    custom_uncertainty_mins: int | None = None,
    city_name: str = "",
    country_name: str = "",
    gender: str = "neutral",  # "male", "female", "neutral"
    name: str = "",
) -> dict:
    # 1. Parse date
    y, m, d = map(int, birth_date.split("-"))
    has_time = bool(birth_time and birth_time.strip() and time_certainty != "unknown")
    
    if has_time:
        parts = birth_time.strip().split(":")
        hh = int(parts[0])
        mm = int(parts[1]) if len(parts) > 1 else 0
        ss = int(parts[2]) if len(parts) > 2 else 0
    else:
        hh, mm, ss = 12, 0, 0  # Default to solar noon for date-only calculations

    # 2. Resolve IANA timezone from coordinates
    tz_name = tf.timezone_at(lat=latitude, lng=longitude) or "UTC"
    tz = ZoneInfo(tz_name)

    # 3. Local civil datetime & UTC instant
    local_dt = datetime(y, m, d, hh, mm, ss, tzinfo=tz)
    utc_dt = local_dt.astimezone(timezone.utc)
    utc_offset_seconds = local_dt.utcoffset().total_seconds()
    utc_offset_hours = utc_offset_seconds / 3600.0
    is_dst = bool(local_dt.dst())

    # 4. Local Mean Solar Time (LMST) and Equation of Time (EoT) -> Local Apparent Solar Time (LAST)
    # Longitude offset: 4 minutes per degree = lon / 15 hours
    solar_time_diff_hours = longitude / 15.0
    lmst_dt = utc_dt + timedelta(hours=solar_time_diff_hours)
    
    # Equation of time calculation via Swiss Ephemeris
    swe.set_ephe_path("")
    jd_ut = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0)
    # swe.time_equ returns equation of time in days
    eot_days = swe.time_equ(jd_ut)
    eot_minutes = eot_days * 24.0 * 60.0
    last_dt = lmst_dt + timedelta(minutes=eot_minutes)

    # 5. Sunrise and Sunset for date
    # swe.rise_trans: returns (ret_flag, tret)
    geopos = (longitude, latitude, 0.0)
    # Rise/Set flags
    res_rise, rise_t = swe.rise_trans(jd_ut - 0.5, swe.SUN, swe.CALC_RISE, geopos, 0, 0, swe.FLG_SWIEPH)
    res_set, set_t = swe.rise_trans(jd_ut - 0.5, swe.SUN, swe.CALC_SET, geopos, 0, 0, swe.FLG_SWIEPH)
    
    sunrise_str = None
    sunset_str = None
    if res_rise == 0 and len(rise_t) > 0 and rise_t[0] > 0:
        r_y, r_m, r_d, r_h = swe.revjul(rise_t[0])
        r_dt_utc = datetime(r_y, r_m, r_d, int(r_h), int((r_h%1)*60), int(((r_h*60)%1)*60), tzinfo=timezone.utc)
        sunrise_str = r_dt_utc.astimezone(tz).strftime("%H:%M:%S")

    if res_set == 0 and len(set_t) > 0 and set_t[0] > 0:
        s_y, s_m, s_d, s_h = swe.revjul(set_t[0])
        s_dt_utc = datetime(s_y, s_m, s_d, int(s_h), int((s_h%1)*60), int(((s_h*60)%1)*60), tzinfo=timezone.utc)
        sunset_str = s_dt_utc.astimezone(tz).strftime("%H:%M:%S")

    # 6. Uncertainty minutes determination
    if custom_uncertainty_mins is not None:
        delta_mins = max(0, custom_uncertainty_mins)
    elif time_certainty == "exact":
        delta_mins = 2  # Standard nominal uncertainty for exact birth record
    elif time_certainty == "rounded_15":
        delta_mins = 15
    elif time_certainty == "approx_30":
        delta_mins = 30
    else:
        delta_mins = 0  # Unknown

    # 7. Uncertainty ensemble instants (T-, T, T+)
    ensemble = []
    if has_time and delta_mins > 0:
        for offset_m in [-delta_mins, 0, delta_mins]:
            edt = local_dt + timedelta(minutes=offset_m)
            e_utc = edt.astimezone(timezone.utc)
            e_jd = swe.julday(e_utc.year, e_utc.month, e_utc.day, e_utc.hour + e_utc.minute/60.0 + e_utc.second/3600.0)
            ensemble.append({
                "label": "T-" if offset_m < 0 else ("T+" if offset_m > 0 else "T"),
                "offset_minutes": offset_m,
                "local_iso": edt.isoformat(),
                "utc_iso": e_utc.isoformat(),
                "jd_ut": e_jd
            })
    else:
        ensemble.append({
            "label": "T",
            "offset_minutes": 0,
            "local_iso": local_dt.isoformat(),
            "utc_iso": utc_dt.isoformat(),
            "jd_ut": jd_ut
        })

    # 8. BaZi two-hour branch and midnight boundary distance
    # Each Chinese shichen is 2 hours, centered on odd hours:
    # Zi: 23:00 - 01:00, Chou: 01:00 - 03:00, etc.
    # Minutes from previous odd hour
    minute_of_day = hh * 60 + mm
    # Distance to next 2-hour boundary: boundaries at 1:00, 3:00, 5:00, 7:00, 9:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00, 23:00
    boundary_minutes = [(h * 60) for h in range(1, 24, 2)] + [23 * 60, 24 * 60 + 60]
    mins_to_bazi_boundary = min(abs(minute_of_day - b) for b in [b for b in boundary_minutes if b <= 24*60] + [b - 24*60 for b in boundary_minutes])

    return {
        "raw_input": {
            "name": name,
            "birth_date": birth_date,
            "birth_time": birth_time,
            "latitude": latitude,
            "longitude": longitude,
            "time_certainty": time_certainty,
            "custom_uncertainty_mins": custom_uncertainty_mins,
            "city_name": city_name,
            "country_name": country_name,
            "gender": gender,
        },
        "normalized": {
            "name": name or "Subject",
            "civil_date": f"{y:04d}-{m:02d}-{d:02d}",
            "civil_time": f"{hh:02d}:{mm:02d}:{ss:02d}",
            "has_birth_time": has_time,
            "latitude": latitude,
            "longitude": longitude,
            "timezone_name": tz_name,
            "utc_offset_hours": utc_offset_hours,
            "is_dst": is_dst,
            "utc_iso": utc_dt.isoformat(),
            "local_iso": local_dt.isoformat(),
            "weekday": local_dt.strftime("%A"),
            "lmst": lmst_dt.strftime("%H:%M:%S"),
            "last": last_dt.strftime("%H:%M:%S"),
            "equation_of_time_minutes": round(eot_minutes, 2),
            "sunrise": sunrise_str,
            "sunset": sunset_str,
            "jd_ut": jd_ut,
        },
        "boundary_audit": {
            "bazi_two_hour_boundary_distance_mins": mins_to_bazi_boundary,
            "is_near_midnight_zi": bool(hh == 23 or hh == 0),
        },
        "uncertainty_ensemble": ensemble,
        "uncertainty_delta_mins": delta_mins
    }
