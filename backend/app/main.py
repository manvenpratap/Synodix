"""
FastAPI application for Synodix Triangulation Engine.
Exposes endpoints for input audit, time-uncertainty testing, multi-tradition chart computation,
dual-engine verification, and cross-cultural synthesis.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from backend.app.core.time_audit import normalize_birth_input
from backend.app.core.ephemeris import compute_astronomical_base
from backend.app.traditions.jyotisha import compute_jyotisha_chart
from backend.app.traditions.bazi import compute_bazi_chart
from backend.app.traditions.western import compute_western_chart
from backend.app.traditions.ziwei import compute_ziwei_chart
from backend.app.traditions.mayan import compute_mayan_chart
from backend.app.traditions.tibetan import compute_tibetan_chart
from backend.app.traditions.persian import compute_persian_chart
from backend.app.traditions.egyptian import compute_egyptian_chart
from backend.app.traditions.maramataka import compute_maramataka_chart
from backend.app.synthesis.verification import build_verification_report
from backend.app.synthesis.synthesis import build_synthesis

app = FastAPI(
    title="Synodix Triangulation Engine API",
    description="Cross-cultural astronomical chart calculation and uncertainty verification engine across classical civilizational systems.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthInputRequest(BaseModel):
    name: Optional[str] = Field(default="", example="Steve Jobs", description="Subject full name")
    birth_date: str = Field(..., example="1985-10-24", description="YYYY-MM-DD")
    birth_time: str = Field(default="", example="15:30", description="HH:MM (24-hour time)")
    time_certainty: str = Field(default="exact", example="exact", description="exact, rounded_15, approx_30, unknown")
    custom_uncertainty_mins: Optional[int] = Field(default=None, description="Explicit uncertainty in minutes")
    latitude: float = Field(..., example=37.7749)
    longitude: float = Field(..., example=-122.4194)
    city_name: str = Field(default="San Francisco", example="San Francisco")
    country_name: str = Field(default="USA", example="USA")
    gender: str = Field(default="male", example="male", description="male, female, neutral")
    house_system: Optional[str] = Field(default="Placidus", description="House system: Placidus, WholeSign, Regiomontanus, Koch, Equal, Campanus")

import json
import os
import urllib.request
import urllib.parse
import math

_data_file = os.path.join(os.path.dirname(__file__), "data", "personalities_100.json")
if os.path.exists(_data_file):
    with open(_data_file, "r", encoding="utf-8") as _f:
        SAMPLE_PRESETS = json.load(_f)
else:
    SAMPLE_PRESETS = [
        {
            "id": "steve-jobs",
            "name": "Steve Jobs",
            "category": "science_tech",
            "tag": "Apple Co-founder",
            "rodden_rating": "AA",
            "birth_date": "1955-02-24",
            "birth_time": "19:15",
            "time_certainty": "exact",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "city_name": "San Francisco",
            "country_name": "USA",
            "gender": "male",
            "note": "Birth Certificate (AA) • Sidereal Leo 29.06° (0.94° cusp) • Ju Men Orator • Viparita Raja Yoga"
        }
    ]

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "engine_version": "2.0.0",
        "primary_astronomy": "Swiss Ephemeris (pyswisseph)",
        "independent_validator": "Skyfield (JPL DE421)",
        "total_sample_profiles": len(SAMPLE_PRESETS),
    }

@app.get("/api/sample-charts")
def get_sample_charts(category: Optional[str] = None):
    if category and category != "all":
        return [p for p in SAMPLE_PRESETS if p.get("category") == category]
    return SAMPLE_PRESETS

# Curated global cities for backend geocoding lookup
_COMMON_CITIES = [
    {"city": "Tokyo", "country": "Japan", "latitude": 35.6762, "longitude": 139.6503},
    {"city": "London", "country": "United Kingdom", "latitude": 51.5074, "longitude": -0.1278},
    {"city": "Paris", "country": "France", "latitude": 48.8566, "longitude": 2.3522},
    {"city": "New York", "country": "United States", "latitude": 40.7128, "longitude": -74.0060},
    {"city": "San Francisco", "country": "United States", "latitude": 37.7749, "longitude": -122.4194},
    {"city": "Los Angeles", "country": "United States", "latitude": 34.0522, "longitude": -118.2437},
    {"city": "Chicago", "country": "United States", "latitude": 41.8781, "longitude": -87.6298},
    {"city": "New Delhi", "country": "India", "latitude": 28.6139, "longitude": 77.2090},
    {"city": "Delhi", "country": "India", "latitude": 28.7041, "longitude": 77.1025},
    {"city": "Gurugram", "country": "India", "latitude": 28.4595, "longitude": 77.0266},
    {"city": "Gurgaon", "country": "India", "latitude": 28.4595, "longitude": 77.0266},
    {"city": "Noida", "country": "India", "latitude": 28.5355, "longitude": 77.3910},
    {"city": "Ghaziabad", "country": "India", "latitude": 28.6692, "longitude": 77.4538},
    {"city": "Faridabad", "country": "India", "latitude": 28.4089, "longitude": 77.3178},
    {"city": "Chandigarh", "country": "India", "latitude": 30.7333, "longitude": 76.7794},
    {"city": "Mumbai", "country": "India", "latitude": 19.0760, "longitude": 72.8777},
    {"city": "Bengaluru", "country": "India", "latitude": 12.9716, "longitude": 77.5946},
    {"city": "Hyderabad", "country": "India", "latitude": 17.3850, "longitude": 78.4867},
    {"city": "Chennai", "country": "India", "latitude": 13.0827, "longitude": 80.2707},
    {"city": "Pune", "country": "India", "latitude": 18.5204, "longitude": 73.8567},
    {"city": "Kolkata", "country": "India", "latitude": 22.5726, "longitude": 88.3639},
    {"city": "Ahmedabad", "country": "India", "latitude": 23.0225, "longitude": 72.5714},
    {"city": "Jaipur", "country": "India", "latitude": 26.9124, "longitude": 75.7873},
    {"city": "Jamshedpur", "country": "India", "latitude": 22.8015, "longitude": 86.2030},
    {"city": "Ranchi", "country": "India", "latitude": 23.3441, "longitude": 85.3096},
    {"city": "Dhanbad", "country": "India", "latitude": 23.7957, "longitude": 86.4304},
    {"city": "Bokaro", "country": "India", "latitude": 23.6693, "longitude": 86.1511},
    {"city": "Patna", "country": "India", "latitude": 25.5941, "longitude": 85.1376},
    {"city": "Lucknow", "country": "India", "latitude": 26.8467, "longitude": 80.9462},
    {"city": "Kanpur", "country": "India", "latitude": 26.4499, "longitude": 80.3319},
    {"city": "Agra", "country": "India", "latitude": 27.1767, "longitude": 78.0081},
    {"city": "Meerut", "country": "India", "latitude": 28.9845, "longitude": 77.7064},
    {"city": "Prayagraj", "country": "India", "latitude": 25.4358, "longitude": 81.8463},
    {"city": "Allahabad", "country": "India", "latitude": 25.4358, "longitude": 81.8463},
    {"city": "Varanasi", "country": "India", "latitude": 25.3176, "longitude": 82.9739},
    {"city": "Amritsar", "country": "India", "latitude": 31.6340, "longitude": 74.8723},
    {"city": "Ludhiana", "country": "India", "latitude": 30.9010, "longitude": 75.8573},
    {"city": "Surat", "country": "India", "latitude": 21.1702, "longitude": 72.8311},
    {"city": "Vadodara", "country": "India", "latitude": 22.3072, "longitude": 73.1812},
    {"city": "Rajkot", "country": "India", "latitude": 22.3039, "longitude": 70.8022},
    {"city": "Nashik", "country": "India", "latitude": 19.9975, "longitude": 73.7898},
    {"city": "Indore", "country": "India", "latitude": 22.7196, "longitude": 75.8577},
    {"city": "Bhopal", "country": "India", "latitude": 23.2599, "longitude": 77.4126},
    {"city": "Gwalior", "country": "India", "latitude": 26.2183, "longitude": 78.1828},
    {"city": "Jabalpur", "country": "India", "latitude": 23.1815, "longitude": 79.9864},
    {"city": "Raipur", "country": "India", "latitude": 21.2514, "longitude": 81.6296},
    {"city": "Bhubaneswar", "country": "India", "latitude": 20.2961, "longitude": 85.8245},
    {"city": "Cuttack", "country": "India", "latitude": 20.4625, "longitude": 85.8828},
    {"city": "Guwahati", "country": "India", "latitude": 26.1445, "longitude": 91.7362},
    {"city": "Dehradun", "country": "India", "latitude": 30.3165, "longitude": 78.0322},
    {"city": "Shimla", "country": "India", "latitude": 31.1048, "longitude": 77.1734},
    {"city": "Jammu", "country": "India", "latitude": 32.7266, "longitude": 74.8570},
    {"city": "Srinagar", "country": "India", "latitude": 34.0837, "longitude": 74.7973},
    {"city": "Coimbatore", "country": "India", "latitude": 11.0168, "longitude": 76.9558},
    {"city": "Madurai", "country": "India", "latitude": 9.9252, "longitude": 78.1198},
    {"city": "Vijayawada", "country": "India", "latitude": 16.5062, "longitude": 80.6480},
    {"city": "Visakhapatnam", "country": "India", "latitude": 17.6868, "longitude": 83.2185},
    {"city": "Kochi", "country": "India", "latitude": 9.9312, "longitude": 76.2673},
    {"city": "Mysore", "country": "India", "latitude": 12.2958, "longitude": 76.6394},
    {"city": "Mangalore", "country": "India", "latitude": 12.9141, "longitude": 74.8560},
    {"city": "Beijing", "country": "China", "latitude": 39.9042, "longitude": 116.4074},
    {"city": "Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.4737},
    {"city": "Cairo", "country": "Egypt", "latitude": 30.0444, "longitude": 31.2357},
    {"city": "Alexandria", "country": "Egypt", "latitude": 31.2001, "longitude": 29.9187},
    {"city": "Baghdad", "country": "Iraq", "latitude": 33.3152, "longitude": 44.3661},
    {"city": "Rome", "country": "Italy", "latitude": 41.9028, "longitude": 12.4964},
    {"city": "Athens", "country": "Greece", "latitude": 37.9838, "longitude": 23.7275},
    {"city": "Sydney", "country": "Australia", "latitude": -33.8688, "longitude": 151.2093},
    {"city": "Auckland", "country": "New Zealand", "latitude": -36.8485, "longitude": 174.7633},
    {"city": "Buenos Aires", "country": "Argentina", "latitude": -34.6037, "longitude": -58.3816},
    {"city": "São Paulo", "country": "Brazil", "latitude": -23.5505, "longitude": -46.6333},
    {"city": "Berlin", "country": "Germany", "latitude": 52.5200, "longitude": 13.4050},
    {"city": "Moscow", "country": "Russia", "latitude": 55.7558, "longitude": 37.6173},
]

@app.get("/api/geocode")
def geocode_city(q: str):
    """
    Auto-suggest and resolve latitude and longitude for a city and country query.
    Searches sample presets, local world cities gazetteer, and enriches via Nominatim OpenStreetMap.
    """
    clean_q = q.strip().lower()
    if not clean_q:
        return []

    results = []
    seen = set()

    # 1. Search sample presets first (historical titan birthplaces)
    for p in SAMPLE_PRESETS:
        city = p.get("city_name", "")
        country = p.get("country_name", "")
        key = f"{city.lower()}-{country.lower()}"
        if key not in seen and (clean_q in city.lower() or clean_q in country.lower()):
            seen.add(key)
            results.append({
                "city": city,
                "country": country,
                "latitude": p.get("latitude", 0.0),
                "longitude": p.get("longitude", 0.0),
                "source": "preset"
            })

    # 2. Search common world cities
    for c in _COMMON_CITIES:
        key = f"{c['city'].lower()}-{c['country'].lower()}"
        if key not in seen and (clean_q in c["city"].lower() or clean_q in c["country"].lower()):
            seen.add(key)
            results.append({
                **c,
                "source": "offline_gazetteer"
            })

    # 3. If query has >=2 characters and results < 8, enrich from Nominatim OpenStreetMap
    if len(clean_q) >= 2 and len(results) < 8:
        try:
            enc_q = urllib.parse.quote(q.strip())
            url = f"https://nominatim.openstreetmap.org/search?q={enc_q}&format=json&limit=8&addressdetails=1"
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "SynodixAstrology/2.28", "Accept-Language": "en"}
            )
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    nom_data = json.loads(resp.read().decode("utf-8"))
                    for item in nom_data:
                        addr = item.get("address", {})
                        city = (
                            addr.get("city")
                            or addr.get("town")
                            or addr.get("village")
                            or addr.get("municipality")
                            or addr.get("suburb")
                            or addr.get("county")
                            or item.get("name")
                        )
                        country = addr.get("country")
                        admin = addr.get("state") or addr.get("province") or addr.get("state_district")
                        lat = float(item.get("lat", 0))
                        lon = float(item.get("lon", 0))
                        if city and country and lat != 0 and lon != 0:
                            key = f"{city.lower()}-{country.lower()}"
                            if key not in seen:
                                seen.add(key)
                                results.append({
                                    "city": city,
                                    "country": country,
                                    "adminCode": admin,
                                    "latitude": round(lat, 4),
                                    "longitude": round(lon, 4),
                                    "source": "online_nominatim"
                                })
                                if len(results) >= 10:
                                    break
        except Exception:
            pass

    return results[:10]

@app.get("/api/reverse-geocode")
def reverse_geocode_endpoint(lat: float, lon: float):
    """
    Reverse geocodes latitude and longitude into city and country names with resilient multi-provider fallback.
    """
    # 1. Primary: Nominatim OpenStreetMap (reliable server-to-server query)
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": "SynodixAstrology/2.27", "Accept-Language": "en"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                addr = data.get("address", {})
                city = (
                    addr.get("city")
                    or addr.get("town")
                    or addr.get("village")
                    or addr.get("municipality")
                    or addr.get("suburb")
                    or addr.get("city_district")
                    or addr.get("county")
                    or addr.get("state")
                )
                country = addr.get("country")
                if city and country:
                    return {"city": city, "country": country, "source": "nominatim"}
    except Exception:
        pass

    # 2. Secondary: Photon OpenStreetMap fallback
    try:
        url = f"https://photon.komoot.io/reverse?lat={lat}&lon={lon}"
        req = urllib.request.Request(url, headers={"User-Agent": "SynodixAstrology/2.27", "Accept-Language": "en"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                feat = (data.get("features") or [{}])[0]
                props = feat.get("properties", {})
                city = (
                    props.get("city")
                    or props.get("town")
                    or props.get("village")
                    or props.get("municipality")
                    or props.get("locality")
                    or props.get("district")
                    or props.get("county")
                )
                country = props.get("country")
                if city and country:
                    return {"city": city, "country": country, "source": "photon"}
    except Exception:
        pass

    # 3. Tertiary: Local nearest-neighbor in _COMMON_CITIES
    closest = None
    min_dist_sq = float("inf")
    for c in _COMMON_CITIES:
        d_lat = c["latitude"] - lat
        d_lon = c["longitude"] - lon
        mean_lat_rad = math.radians((c["latitude"] + lat) / 2)
        scaled_d_lon = d_lon * math.cos(mean_lat_rad)
        dist_sq = d_lat * d_lat + scaled_d_lon * scaled_d_lon
        if dist_sq < min_dist_sq:
            min_dist_sq = dist_sq
            closest = c

    if closest:
        return {"city": closest["city"], "country": closest["country"], "source": "local_gazetteer"}

    return {"city": "Unknown City", "country": "Unknown Country", "source": "fallback"}

@app.get("/api/ip-location")
def ip_location_endpoint():
    """
    Fallback location detection via IP when HTML5 Geolocation is denied or unavailable.
    """
    try:
        req = urllib.request.Request("http://ip-api.com/json/", headers={"User-Agent": "SynodixAstrology/2.27"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("status") == "success":
                    return {
                        "latitude": round(float(data.get("lat", 0.0)), 4),
                        "longitude": round(float(data.get("lon", 0.0)), 4),
                        "city": data.get("city", ""),
                        "country": data.get("country", ""),
                        "source": "ip_geolocation"
                    }
    except Exception:
        pass
    return None

@app.get("/api/mathematical-evidence")
def get_mathematical_evidence():
    stats_file = os.path.join(os.path.dirname(__file__), "data", "mathematical_evidence_stats.json")
    report_file = os.path.join(os.path.dirname(__file__), "data", "mathematical_evidence_astrology_report.md")
    stats = {}
    report_md = ""
    if os.path.exists(stats_file):
        with open(stats_file, "r", encoding="utf-8") as f:
            stats = json.load(f)
    if os.path.exists(report_file):
        with open(report_file, "r", encoding="utf-8") as f:
            report_md = f.read()
    return {
        "title": "Mathematical Evidence & Empirical Validation of Astrological Modeling",
        "cohort_titans": 100,
        "cohort_controls": 1000,
        "stats": stats,
        "report_markdown": report_md
    }

@app.get("/api/mathematical-evidence/report")
def get_mathematical_evidence_report():
    from fastapi.responses import PlainTextResponse
    report_file = os.path.join(os.path.dirname(__file__), "data", "mathematical_evidence_astrology_report.md")
    if os.path.exists(report_file):
        with open(report_file, "r", encoding="utf-8") as f:
            content = f.read()
        return PlainTextResponse(content, media_type="text/markdown")
    raise HTTPException(status_code=404, detail="Evidence report not found")

@app.post("/api/audit-input")
def audit_input_endpoint(req: BirthInputRequest):
    try:
        audit = normalize_birth_input(
            birth_date=req.birth_date,
            birth_time=req.birth_time,
            latitude=req.latitude,
            longitude=req.longitude,
            time_certainty=req.time_certainty,
            custom_uncertainty_mins=req.custom_uncertainty_mins,
            city_name=req.city_name,
            country_name=req.country_name,
            gender=req.gender,
            name=req.name or ""
        )
        return audit
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Input audit failed: {str(e)}")

@app.post("/api/compute-chart")
def compute_chart_endpoint(req: BirthInputRequest):
    try:
        # Step 2: Input normalization & audit
        audit = normalize_birth_input(
            birth_date=req.birth_date,
            birth_time=req.birth_time,
            latitude=req.latitude,
            longitude=req.longitude,
            time_certainty=req.time_certainty,
            custom_uncertainty_mins=req.custom_uncertainty_mins,
            city_name=req.city_name,
            country_name=req.country_name,
            gender=req.gender,
            name=req.name or ""
        )

        has_time = audit["normalized"]["has_birth_time"]
        jd_ut = audit["normalized"]["jd_ut"]

        # Step 4A: Shared Astronomical Base & Dual-Engine Verification
        astro_base = compute_astronomical_base(
            jd_ut=jd_ut,
            latitude=req.latitude,
            longitude=req.longitude,
            has_birth_time=has_time,
            house_system=req.house_system or "Placidus"
        )

        # Step 2 Time Uncertainty Ensemble Testing:
        # Compute Ascendant and D9 Navamsha across T-, T, T+
        ensemble_results = []
        for inst in audit["uncertainty_ensemble"]:
            sub_astro = compute_astronomical_base(
                jd_ut=inst["jd_ut"],
                latitude=req.latitude,
                longitude=req.longitude,
                has_birth_time=has_time
            )
            tropical_asc = sub_astro["angles"]["tropical"]["ascendant_sign"]
            sidereal_asc = sub_astro["angles"]["sidereal"]["ascendant_sign"]
            ensemble_results.append({
                "label": inst["label"],
                "offset_minutes": inst["offset_minutes"],
                "tropical_asc_sign": tropical_asc,
                "sidereal_asc_sign": sidereal_asc,
            })

        # Classify stability
        is_tropical_asc_stable = len(set(r["tropical_asc_sign"] for r in ensemble_results)) == 1
        is_sidereal_asc_stable = len(set(r["sidereal_asc_sign"] for r in ensemble_results)) == 1

        uncertainty_classification = {
            "tropical_ascendant": "STABLE" if is_tropical_asc_stable else "SENSITIVE",
            "sidereal_ascendant": "STABLE" if is_sidereal_asc_stable else "SENSITIVE",
            "ensemble_alternatives": ensemble_results
        }

        # Step 4B to 4G: Compute 6 traditions
        birth_dt = datetime.fromisoformat(audit["normalized"]["local_iso"]).replace(tzinfo=None)
        
        # 1. Jyotisha
        jyotisha = compute_jyotisha_chart(astro_base, birth_dt, has_birth_time=has_time)
        
        # 2. BaZi
        b_year = int(req.birth_date.split("-")[0])
        b_month = int(req.birth_date.split("-")[1])
        b_day = int(req.birth_date.split("-")[2])
        b_hour = birth_dt.hour if has_time else 12
        b_min = birth_dt.minute if has_time else 0
        bazi = compute_bazi_chart(b_year, b_month, b_day, b_hour, b_min, 0, gender=req.gender, has_birth_time=has_time)

        # 3. Western
        current_year = datetime.utcnow().year
        approx_age = max(1, current_year - b_year)
        western = compute_western_chart(astro_base, current_age=approx_age, has_birth_time=has_time)

        # 4. Zi Wei Dou Shu
        ziwei = compute_ziwei_chart(b_year, b_month, b_day, b_hour, b_min, 0, gender=req.gender, has_birth_time=has_time)

        # 5. Maya Calendar
        mayan = compute_mayan_chart(b_year, b_month, b_day)

        # 6. Tibetan Elemental
        tibetan = compute_tibetan_chart(b_year, gender=req.gender)

        # 7. Persian & Medieval Arabic (Ilm al-Nujūm)
        persian = compute_persian_chart(astro_base, b_year, req.birth_time)

        # 8. Ancient Egyptian Decans & Chronocrator
        egyptian = compute_egyptian_chart(astro_base, b_year, b_month, b_day, req.birth_time, req.latitude, req.longitude)

        # 9. Polynesian & Māori Maramataka
        maramataka = compute_maramataka_chart(astro_base)

        # Step 5: Verification Report
        verification_report = build_verification_report(
            astro_base, jyotisha, bazi, western, ziwei, mayan, tibetan, audit
        )

        # Step 7: Synthesis Engine without double-counting
        synthesis = build_synthesis(
            astro_base, jyotisha, bazi, western, ziwei, mayan, tibetan, verification_report, audit,
            persian_chart=persian
        )

        return {
            "birth_input_audit": audit,
            "uncertainty_classification": uncertainty_classification,
            "astronomical_base": astro_base,
            "traditions": {
                "jyotisha": jyotisha,
                "bazi": bazi,
                "western": western,
                "ziwei": ziwei,
                "mayan": mayan,
                "tibetan": tibetan,
                "persian": persian,
                "egyptian": egyptian,
                "maramataka": maramataka
            },
            "verification_report": verification_report,
            "synthesis": synthesis,
            "calculation_manifest": {
                "python_runtime": "3.12.13",
                "ephemeris_engine": "Swiss Ephemeris 2.10.3.2",
                "validator_engine": "Skyfield 1.55 with JPL DE421",
                "timezone_database": "IANA / timezonefinder 9.0.0",
                "calendar_engines": "lunar_python 1.4.8 & convertdate 2.5.1",
                "execution_timestamp": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Chart computation failed: {str(e)}")

# Serve production React build if dist exists
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Do not catch API paths
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        # Serve exact file if present in dist (e.g. manifest.json, sw.js, favicon.svg)
        if full_path:
            file_path = os.path.join(dist_path, full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
        index_path = os.path.join(dist_path, "index.html")
        return FileResponse(index_path)

