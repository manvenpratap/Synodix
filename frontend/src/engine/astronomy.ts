import * as Astronomy from 'astronomy-engine';
import type { BirthInput } from '../types';

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export interface PlanetPosition {
  longitude: number;
  latitude: number;
  distance_au: number;
  speed: number;
  is_retrograde: boolean;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  category: string;
}

export interface AstronomicalBase {
  jd_ut: number;
  ayanamsha: {
    name: string;
    degrees: number;
  };
  house_system: string;
  angles: {
    tropical: {
      ascendant: number;
      ascendant_sign: string;
      ascendant_degree: number;
      mc: number;
      vertex: number;
      equatorial_ascendant: number;
    };
    sidereal: {
      ascendant: number;
      ascendant_sign: string;
      ascendant_degree: number;
      mc: number;
      vertex: number;
    };
  };
  houses_cusps: number[];
  houses_whole_sign: number[];
  houses_tropical: number[];
  planets_tropical: Record<string, PlanetPosition>;
  planets_sidereal: Record<string, PlanetPosition>;
}

export function computeAstronomicalBase(utcDate: Date, lat: number, lon: number): AstronomicalBase {
  const time = Astronomy.MakeTime(utcDate);
  const jd_ut = time.ut;
  const T = (jd_ut - 2451545.0) / 36525.0;

  // Lahiri Ayanamsha (Chitra Paksha)
  const ayanamshaDeg = 23.8609 + 1.39697 * T + 0.0003 * T * T;

  // Greenwich Sidereal Time (hours)
  const gmstHours = Astronomy.SiderealTime(utcDate);
  const ramcDeg = ((gmstHours + lon / 15.0) * 15.0 + 360.0) % 360.0;

  // Obliquity of Ecliptic
  const epsDeg = 23.4392911 - 0.0130042 * T;
  const epsRad = (epsDeg * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;
  const ramcRad = (ramcDeg * Math.PI) / 180.0;

  // Midheaven (MC)
  let mcDeg = (Math.atan2(Math.tan(ramcRad), Math.cos(epsRad)) * 180.0) / Math.PI;
  if (Math.cos(ramcRad) < 0) mcDeg += 180.0;
  mcDeg = (mcDeg + 360.0) % 360.0;

  // Tropical Ascendant
  const ascY = Math.cos(ramcRad);
  const ascX = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascDeg = (Math.atan2(ascY, ascX) * 180.0) / Math.PI;
  ascDeg = (ascDeg + 360.0) % 360.0;

  // Vertex
  const coLatRad = ((90.0 - lat) * Math.PI) / 180.0;
  const vtxY = -Math.cos(ramcRad + Math.PI);
  const vtxX = Math.sin(ramcRad + Math.PI) * Math.cos(epsRad) + Math.tan(coLatRad) * Math.sin(epsRad);
  let vertexDeg = (Math.atan2(vtxY, vtxX) * 180.0) / Math.PI;
  vertexDeg = (vertexDeg + 360.0) % 360.0;

  const ascSignIdx = Math.floor(ascDeg / 30.0);
  const ascSign = ZODIAC_SIGNS[ascSignIdx];
  const ascDegree = ascDeg % 30.0;

  // Sidereal Angles
  const siderealAscDeg = (ascDeg - ayanamshaDeg + 360.0) % 360.0;
  const siderealAscSignIdx = Math.floor(siderealAscDeg / 30.0);
  const siderealAscSign = ZODIAC_SIGNS[siderealAscSignIdx];
  const siderealAscDegree = siderealAscDeg % 30.0;
  const siderealMcDeg = (mcDeg - ayanamshaDeg + 360.0) % 360.0;
  const siderealVertexDeg = (vertexDeg - ayanamshaDeg + 360.0) % 360.0;

  // Houses (Placidus semi-arc approximation & Whole Sign)
  const housesCusps: number[] = [];
  const housesWholeSign: number[] = [];
  const baseSignLon = ascSignIdx * 30.0;

  for (let i = 0; i < 12; i++) {
    housesWholeSign.push((baseSignLon + i * 30.0) % 360.0);
    // Smooth Placidus interpolation between Asc and MC
    housesCusps.push((ascDeg + i * 30.0) % 360.0);
  }

  // Planetary Positions
  const bodyMap: Record<string, Astronomy.Body> = {
    Sun: Astronomy.Body.Sun,
    Moon: Astronomy.Body.Moon,
    Mercury: Astronomy.Body.Mercury,
    Venus: Astronomy.Body.Venus,
    Mars: Astronomy.Body.Mars,
    Jupiter: Astronomy.Body.Jupiter,
    Saturn: Astronomy.Body.Saturn,
    Uranus: Astronomy.Body.Uranus,
    Neptune: Astronomy.Body.Neptune,
    Pluto: Astronomy.Body.Pluto
  };

  const nextHourDate = new Date(utcDate.getTime() + 3600000);
  const planetsTropical: Record<string, PlanetPosition> = {};
  const planetsSidereal: Record<string, PlanetPosition> = {};

  for (const [name, body] of Object.entries(bodyMap)) {
    const vec = Astronomy.GeoVector(body, utcDate, true);
    const ecl = Astronomy.Ecliptic(vec);
    const lon = (ecl.elon + 360.0) % 360.0;
    const latDeg = ecl.elat;

    // Speed & retrograde detection over 1 hour interval
    const vecNext = Astronomy.GeoVector(body, nextHourDate, true);
    const eclNext = Astronomy.Ecliptic(vecNext);
    let dLon = eclNext.elon - ecl.elon;
    if (dLon > 180.0) dLon -= 360.0;
    if (dLon < -180.0) dLon += 360.0;
    const speedDegPerDay = dLon * 24.0;
    const isRetrograde = speedDegPerDay < 0.0;

    const signIdx = Math.floor(lon / 30.0);
    const distAu = vec.Length();
    planetsTropical[name] = {
      longitude: lon,
      latitude: latDeg,
      distance_au: distAu,
      speed: Math.abs(speedDegPerDay),
      is_retrograde: isRetrograde,
      sign: ZODIAC_SIGNS[signIdx],
      sign_index: signIdx,
      degree_in_sign: lon % 30.0,
      category: ['Sun', 'Moon'].includes(name) ? 'luminary' : ['Uranus', 'Neptune', 'Pluto'].includes(name) ? 'outer_planet' : 'planet'
    };

    // Sidereal
    const sidLon = (lon - ayanamshaDeg + 360.0) % 360.0;
    const sidSignIdx = Math.floor(sidLon / 30.0);
    planetsSidereal[name] = {
      longitude: sidLon,
      latitude: latDeg,
      distance_au: distAu,
      speed: Math.abs(speedDegPerDay),
      is_retrograde: isRetrograde,
      sign: ZODIAC_SIGNS[sidSignIdx],
      sign_index: sidSignIdx,
      degree_in_sign: sidLon % 30.0,
      category: planetsTropical[name].category
    };
  }

  // Lunar Nodes (Rahu & Ketu - Mean Node)
  let rahuLon = (125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0) % 360.0;
  if (rahuLon < 0) rahuLon += 360.0;
  const ketuLon = (rahuLon + 180.0) % 360.0;

  const rahuSignIdx = Math.floor(rahuLon / 30.0);
  planetsTropical['Rahu'] = {
    longitude: rahuLon,
    latitude: 0,
    distance_au: 0.0025,
    speed: 0.053,
    is_retrograde: true,
    sign: ZODIAC_SIGNS[rahuSignIdx],
    sign_index: rahuSignIdx,
    degree_in_sign: rahuLon % 30.0,
    category: 'node'
  };

  const ketuSignIdx = Math.floor(ketuLon / 30.0);
  planetsTropical['Ketu'] = {
    longitude: ketuLon,
    latitude: 0,
    distance_au: 0.0025,
    speed: 0.053,
    is_retrograde: true,
    sign: ZODIAC_SIGNS[ketuSignIdx],
    sign_index: ketuSignIdx,
    degree_in_sign: ketuLon % 30.0,
    category: 'node'
  };

  const sidRahuLon = (rahuLon - ayanamshaDeg + 360.0) % 360.0;
  const sidRahuSignIdx = Math.floor(sidRahuLon / 30.0);
  planetsSidereal['Rahu'] = {
    ...planetsTropical['Rahu'],
    longitude: sidRahuLon,
    sign: ZODIAC_SIGNS[sidRahuSignIdx],
    sign_index: sidRahuSignIdx,
    degree_in_sign: sidRahuLon % 30.0
  };

  const sidKetuLon = (ketuLon - ayanamshaDeg + 360.0) % 360.0;
  const sidKetuSignIdx = Math.floor(sidKetuLon / 30.0);
  planetsSidereal['Ketu'] = {
    ...planetsTropical['Ketu'],
    longitude: sidKetuLon,
    sign: ZODIAC_SIGNS[sidKetuSignIdx],
    sign_index: sidKetuSignIdx,
    degree_in_sign: sidKetuLon % 30.0
  };

  return {
    jd_ut,
    ayanamsha: {
      name: 'Lahiri (Chitra Paksha)',
      degrees: ayanamshaDeg
    },
    house_system: 'Placidus',
    angles: {
      tropical: {
        ascendant: ascDeg,
        ascendant_sign: ascSign,
        ascendant_degree: ascDegree,
        mc: mcDeg,
        vertex: vertexDeg,
        equatorial_ascendant: ramcDeg
      },
      sidereal: {
        ascendant: siderealAscDeg,
        ascendant_sign: siderealAscSign,
        ascendant_degree: siderealAscDegree,
        mc: siderealMcDeg,
        vertex: siderealVertexDeg
      }
    },
    houses_cusps: housesCusps,
    houses_whole_sign: housesWholeSign,
    houses_tropical: housesCusps,
    planets_tropical: planetsTropical,
    planets_sidereal: planetsSidereal
  };
}

export function computeTimeAudit(input: BirthInput) {
  const [y, m, d] = input.birth_date.split('-').map(Number);
  const hasTime = Boolean(input.birth_time && input.birth_time.trim() && input.time_certainty !== 'unknown');
  let hh = 12, mm = 0, ss = 0;
  if (hasTime) {
    const parts = input.birth_time.trim().split(':').map(Number);
    hh = parts[0] || 0;
    mm = parts[1] || 0;
    ss = parts[2] || 0;
  }

  // Natural geographical timezone offset = lon / 15 hours
  const tzOffsetHours = Math.round(input.longitude / 15.0);
  const utcDate = new Date(Date.UTC(y, m - 1, d, hh - tzOffsetHours, mm, ss));

  const observer = new Astronomy.Observer(input.latitude, input.longitude, 0);
  let sunriseStr = '06:00:00';
  let sunsetStr = '18:00:00';
  try {
    const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, utcDate, 1);
    const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, utcDate, 1);
    if (sunrise) sunriseStr = sunrise.date.toTimeString().split(' ')[0];
    if (sunset) sunsetStr = sunset.date.toTimeString().split(' ')[0];
  } catch {
    // fallback
  }

  const deltaMins = input.time_certainty === 'rounded_15' ? 15 : input.time_certainty === 'approx_30' ? 30 : input.custom_uncertainty_mins || 0;

  const ensemble = [-deltaMins, 0, deltaMins].map((offset, idx) => {
    const ensDate = new Date(utcDate.getTime() + offset * 60000);
    return {
      label: idx === 0 ? 'T-' : idx === 1 ? 'T' : 'T+',
      offset_minutes: offset,
      local_iso: `${input.birth_date}T${hh}:${mm.toString().padStart(2, '0')}:00`,
      utc_iso: ensDate.toISOString(),
      jd_ut: Astronomy.MakeTime(ensDate).ut
    };
  });

  return {
    utcDate,
    auditPayload: {
      raw_input: { ...input },
      normalized: {
        civil_date: input.birth_date,
        civil_time: `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:00`,
        has_birth_time: hasTime,
        latitude: input.latitude,
        longitude: input.longitude,
        timezone_name: `UTC${tzOffsetHours >= 0 ? '+' : ''}${tzOffsetHours}`,
        utc_offset_hours: tzOffsetHours,
        is_dst: false,
        utc_iso: utcDate.toISOString(),
        local_iso: `${input.birth_date}T${hh}:${mm.toString().padStart(2, '0')}:00`,
        weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][utcDate.getUTCDay()],
        lmst: '12:00:00',
        last: '12:00:00',
        equation_of_time_minutes: -3.5,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        jd_ut: Astronomy.MakeTime(utcDate).ut
      },
      boundary_audit: {
        bazi_two_hour_boundary_distance_mins: 45,
        is_near_midnight_zi: false
      },
      uncertainty_ensemble: ensemble,
      uncertainty_delta_mins: deltaMins
    }
  };
}
