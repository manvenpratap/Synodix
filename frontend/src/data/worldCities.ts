/**
 * worldCities.ts — Comprehensive Curated Global Cities & Historical Astrological Centers
 * 
 * Provides offline geodetic coordinates (WGS-84 Decimal Latitude & Longitude)
 * for instant 0ms client-side auto-suggest and automatic coordinate resolution.
 */

export interface CityRecord {
  city: string;
  country: string;
  adminCode?: string; // State / Province / Territory
  latitude: number;
  longitude: number;
  timezone?: string;
  isHistorical?: boolean;
}

export const WORLD_CITIES: CityRecord[] = [
  // --- North America: USA ---
  { city: 'New York', adminCode: 'NY', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { city: 'Brooklyn', adminCode: 'NY', country: 'United States', latitude: 40.6782, longitude: -73.9442, timezone: 'America/New_York' },
  { city: 'Los Angeles', adminCode: 'CA', country: 'United States', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { city: 'San Francisco', adminCode: 'CA', country: 'United States', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { city: 'Chicago', adminCode: 'IL', country: 'United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { city: 'Houston', adminCode: 'TX', country: 'United States', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago' },
  { city: 'Phoenix', adminCode: 'AZ', country: 'United States', latitude: 33.4484, longitude: -112.0740, timezone: 'America/Phoenix' },
  { city: 'Philadelphia', adminCode: 'PA', country: 'United States', latitude: 39.9526, longitude: -75.1652, timezone: 'America/New_York' },
  { city: 'San Antonio', adminCode: 'TX', country: 'United States', latitude: 29.4241, longitude: -98.4936, timezone: 'America/Chicago' },
  { city: 'San Diego', adminCode: 'CA', country: 'United States', latitude: 32.7157, longitude: -117.1611, timezone: 'America/Los_Angeles' },
  { city: 'Dallas', adminCode: 'TX', country: 'United States', latitude: 32.7767, longitude: -96.7970, timezone: 'America/Chicago' },
  { city: 'Austin', adminCode: 'TX', country: 'United States', latitude: 30.2672, longitude: -97.7431, timezone: 'America/Chicago' },
  { city: 'Seattle', adminCode: 'WA', country: 'United States', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles' },
  { city: 'Boston', adminCode: 'MA', country: 'United States', latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York' },
  { city: 'Brookline', adminCode: 'MA', country: 'United States', latitude: 42.3318, longitude: -71.1212, timezone: 'America/New_York' },
  { city: 'Washington', adminCode: 'DC', country: 'United States', latitude: 38.9072, longitude: -77.0369, timezone: 'America/New_York' },
  { city: 'Denver', adminCode: 'CO', country: 'United States', latitude: 39.7392, longitude: -104.9903, timezone: 'America/Denver' },
  { city: 'Atlanta', adminCode: 'GA', country: 'United States', latitude: 33.7490, longitude: -84.3880, timezone: 'America/New_York' },
  { city: 'Miami', adminCode: 'FL', country: 'United States', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
  { city: 'Detroit', adminCode: 'MI', country: 'United States', latitude: 42.3314, longitude: -83.0458, timezone: 'America/Detroit' },
  { city: 'Minneapolis', adminCode: 'MN', country: 'United States', latitude: 44.9778, longitude: -93.2650, timezone: 'America/Chicago' },
  { city: 'Duluth', adminCode: 'MN', country: 'United States', latitude: 46.7867, longitude: -92.1005, timezone: 'America/Chicago' },
  { city: 'Portland', adminCode: 'OR', country: 'United States', latitude: 45.5152, longitude: -122.6784, timezone: 'America/Los_Angeles' },
  { city: 'Honolulu', adminCode: 'HI', country: 'United States', latitude: 21.3069, longitude: -157.8583, timezone: 'Pacific/Honolulu' },
  { city: 'Omaha', adminCode: 'NE', country: 'United States', latitude: 41.2565, longitude: -95.9345, timezone: 'America/Chicago' },
  { city: 'Louisville', adminCode: 'KY', country: 'United States', latitude: 38.2527, longitude: -85.7585, timezone: 'America/Kentucky/Louisville' },
  { city: 'Hodgenville', adminCode: 'KY', country: 'United States', latitude: 37.5739, longitude: -85.7402, timezone: 'America/Kentucky/Louisville' },
  { city: 'Cincinnati', adminCode: 'OH', country: 'United States', latitude: 39.1031, longitude: -84.5120, timezone: 'America/New_York' },
  { city: 'Gary', adminCode: 'IN', country: 'United States', latitude: 41.5934, longitude: -87.3464, timezone: 'America/Indiana/Indianapolis' },
  { city: 'Oak Park', adminCode: 'IL', country: 'United States', latitude: 41.8850, longitude: -87.7845, timezone: 'America/Chicago' },
  { city: 'Modesto', adminCode: 'CA', country: 'United States', latitude: 37.6391, longitude: -120.9969, timezone: 'America/Los_Angeles' },
  { city: 'Long Beach', adminCode: 'CA', country: 'United States', latitude: 33.7701, longitude: -118.1937, timezone: 'America/Los_Angeles' },
  { city: 'Saginaw', adminCode: 'MI', country: 'United States', latitude: 43.4195, longitude: -83.9508, timezone: 'America/Detroit' },
  { city: 'Summit', adminCode: 'NJ', country: 'United States', latitude: 40.7157, longitude: -74.3574, timezone: 'America/New_York' },
  { city: 'Kosciusko', adminCode: 'MS', country: 'United States', latitude: 33.0574, longitude: -89.5879, timezone: 'America/Chicago' },
  { city: 'Hyde Park', adminCode: 'NY', country: 'United States', latitude: 41.7845, longitude: -73.9332, timezone: 'America/New_York' },
  { city: 'Woodstock', adminCode: 'NY', country: 'United States', latitude: 42.0409, longitude: -74.1182, timezone: 'America/New_York' },
  { city: 'Colonial Beach', adminCode: 'VA', country: 'United States', latitude: 38.2529, longitude: -76.9602, timezone: 'America/New_York' },

  // --- North America: Canada & Mexico ---
  { city: 'Toronto', adminCode: 'ON', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { city: 'Montreal', adminCode: 'QC', country: 'Canada', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto' },
  { city: 'Vancouver', adminCode: 'BC', country: 'Canada', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
  { city: 'Ottawa', adminCode: 'ON', country: 'Canada', latitude: 45.4215, longitude: -75.6972, timezone: 'America/Toronto' },
  { city: 'Calgary', adminCode: 'AB', country: 'Canada', latitude: 51.0447, longitude: -114.0719, timezone: 'America/Edmonton' },
  { city: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City' },
  { city: 'Coyoacán', country: 'Mexico', latitude: 19.3497, longitude: -99.1624, timezone: 'America/Mexico_City' },
  { city: 'Guadalajara', country: 'Mexico', latitude: 20.6597, longitude: -103.3496, timezone: 'America/Mexico_City' },
  { city: 'Monterrey', country: 'Mexico', latitude: 25.6866, longitude: -100.3161, timezone: 'America/Monterrey' },
  { city: 'Merida', country: 'Mexico', latitude: 20.9674, longitude: -89.5926, timezone: 'America/Merida', isHistorical: true },

  // --- Central & South America ---
  { city: 'Palenque', country: 'Mexico', latitude: 17.5092, longitude: -91.9822, isHistorical: true },
  { city: 'Copán', country: 'Honduras', latitude: 14.8389, longitude: -89.1558, isHistorical: true },
  { city: 'Guatemala City', country: 'Guatemala', latitude: 14.6349, longitude: -90.5069, timezone: 'America/Guatemala' },
  { city: 'San José', country: 'Costa Rica', latitude: 9.9281, longitude: -84.0907, timezone: 'America/Costa_Rica' },
  { city: 'Panama City', country: 'Panama', latitude: 8.9824, longitude: -79.5199, timezone: 'America/Panama' },
  { city: 'Bogotá', country: 'Colombia', latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota' },
  { city: 'Medellín', country: 'Colombia', latitude: 6.2442, longitude: -75.5812, timezone: 'America/Bogota' },
  { city: 'Lima', country: 'Peru', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima' },
  { city: 'Cusco', country: 'Peru', latitude: -13.5319, longitude: -71.9675, timezone: 'America/Lima', isHistorical: true },
  { city: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago' },
  { city: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'Rosario', country: 'Argentina', latitude: -32.9468, longitude: -60.6393, timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'Lanús', country: 'Argentina', latitude: -34.7042, longitude: -58.3970, timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
  { city: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
  { city: 'Brasília', country: 'Brazil', latitude: -15.8267, longitude: -47.9218, timezone: 'America/Sao_Paulo' },
  { city: 'Três Corações', country: 'Brazil', latitude: -21.6961, longitude: -45.2586, timezone: 'America/Sao_Paulo' },

  // --- Western & Northern Europe ---
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { city: 'Woolsthorpe', country: 'United Kingdom', latitude: 52.8094, longitude: -0.6300, timezone: 'Europe/London', isHistorical: true },
  { city: 'Oxford', country: 'United Kingdom', latitude: 51.7520, longitude: -1.2577, timezone: 'Europe/London' },
  { city: 'Cambridge', country: 'United Kingdom', latitude: 52.2053, longitude: 0.1218, timezone: 'Europe/London' },
  { city: 'Liverpool', country: 'United Kingdom', latitude: 53.4084, longitude: -2.9916, timezone: 'Europe/London' },
  { city: 'Manchester', country: 'United Kingdom', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
  { city: 'Edinburgh', country: 'United Kingdom', latitude: 55.9533, longitude: -3.1883, timezone: 'Europe/London' },
  { city: 'Glasgow', country: 'United Kingdom', latitude: 55.8642, longitude: -4.2518, timezone: 'Europe/London' },
  { city: 'Birmingham', country: 'United Kingdom', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London' },
  { city: 'Shrewsbury', country: 'United Kingdom', latitude: 52.7073, longitude: -2.7553, timezone: 'Europe/London' },
  { city: 'Stratford-upon-Avon', country: 'United Kingdom', latitude: 52.1917, longitude: -1.7083, timezone: 'Europe/London', isHistorical: true },
  { city: 'Grantham', country: 'United Kingdom', latitude: 52.9150, longitude: -0.6430, timezone: 'Europe/London' },
  { city: 'Reading', country: 'United Kingdom', latitude: 51.4543, longitude: -0.9781, timezone: 'Europe/London' },
  { city: 'Stevenage', country: 'United Kingdom', latitude: 51.9038, longitude: -0.1969, timezone: 'Europe/London' },
  { city: 'Chislehurst', country: 'United Kingdom', latitude: 51.4167, longitude: 0.0667, timezone: 'Europe/London' },
  { city: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin' },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { city: 'Lille', country: 'France', latitude: 50.6292, longitude: 3.0573, timezone: 'Europe/Paris' },
  { city: 'Lyon', country: 'France', latitude: 45.7640, longitude: 4.8357, timezone: 'Europe/Paris' },
  { city: 'Marseille', country: 'France', latitude: 43.2965, longitude: 5.3698, timezone: 'Europe/Paris' },
  { city: 'Nice', country: 'France', latitude: 43.7102, longitude: 7.2620, timezone: 'Europe/Paris' },
  { city: 'Besançon', country: 'France', latitude: 47.2378, longitude: 6.0241, timezone: 'Europe/Paris' },
  { city: 'Ajaccio', country: 'France', latitude: 41.9192, longitude: 8.7386, timezone: 'Europe/Paris' },
  { city: 'Brussels', country: 'Belgium', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels' },
  { city: 'Ixelles', country: 'Belgium', latitude: 50.8267, longitude: 4.3667, timezone: 'Europe/Brussels' },
  { city: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
  { city: 'Rotterdam', country: 'Netherlands', latitude: 51.9244, longitude: 4.4777, timezone: 'Europe/Amsterdam' },
  { city: 'The Hague', country: 'Netherlands', latitude: 52.0705, longitude: 4.3007, timezone: 'Europe/Amsterdam' },
  { city: 'Zundert', country: 'Netherlands', latitude: 51.4697, longitude: 4.6617, timezone: 'Europe/Amsterdam' },
  { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { city: 'Munich', country: 'Germany', latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin' },
  { city: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821, timezone: 'Europe/Berlin' },
  { city: 'Hamburg', country: 'Germany', latitude: 53.5511, longitude: 9.9937, timezone: 'Europe/Berlin' },
  { city: 'Cologne', country: 'Germany', latitude: 50.9375, longitude: 6.9603, timezone: 'Europe/Berlin' },
  { city: 'Ulm', country: 'Germany', latitude: 48.4011, longitude: 9.9876, timezone: 'Europe/Berlin' },
  { city: 'Bonn', country: 'Germany', latitude: 50.7374, longitude: 7.0982, timezone: 'Europe/Berlin' },
  { city: 'Würzburg', country: 'Germany', latitude: 49.7913, longitude: 9.9534, timezone: 'Europe/Berlin' },
  { city: 'Kiel', country: 'Germany', latitude: 54.3233, longitude: 10.1228, timezone: 'Europe/Berlin' },
  { city: 'Röcken', country: 'Germany', latitude: 51.2408, longitude: 12.1158, timezone: 'Europe/Berlin' },
  { city: 'Weil der Stadt', country: 'Germany', latitude: 48.7503, longitude: 8.8703, timezone: 'Europe/Berlin', isHistorical: true },

  // --- Central & Southern Europe ---
  { city: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna' },
  { city: 'Salzburg', country: 'Austria', latitude: 47.8095, longitude: 13.0550, timezone: 'Europe/Vienna' },
  { city: 'Thal', country: 'Austria', latitude: 47.0789, longitude: 15.3589, timezone: 'Europe/Vienna' },
  { city: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  { city: 'Geneva', country: 'Switzerland', latitude: 46.2044, longitude: 6.1432, timezone: 'Europe/Zurich' },
  { city: 'Basel', country: 'Switzerland', latitude: 47.5596, longitude: 7.5886, timezone: 'Europe/Zurich' },
  { city: 'Kesswil', country: 'Switzerland', latitude: 47.5936, longitude: 9.3178, timezone: 'Europe/Zurich' },
  { city: 'Bern', country: 'Switzerland', latitude: 46.9480, longitude: 7.4474, timezone: 'Europe/Zurich' },
  { city: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', isHistorical: true },
  { city: 'Milan', country: 'Italy', latitude: 45.4642, longitude: 9.1900, timezone: 'Europe/Rome' },
  { city: 'Florence', country: 'Italy', latitude: 43.7696, longitude: 11.2558, timezone: 'Europe/Rome' },
  { city: 'Venice', country: 'Italy', latitude: 45.4408, longitude: 12.3155, timezone: 'Europe/Rome' },
  { city: 'Naples', country: 'Italy', latitude: 40.8518, longitude: 14.2681, timezone: 'Europe/Rome' },
  { city: 'Pisa', country: 'Italy', latitude: 43.7228, longitude: 10.4017, timezone: 'Europe/Rome' },
  { city: 'Vinci', country: 'Italy', latitude: 43.7828, longitude: 10.9250, timezone: 'Europe/Rome', isHistorical: true },
  { city: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { city: 'Barcelona', country: 'Spain', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid' },
  { city: 'Seville', country: 'Spain', latitude: 37.3891, longitude: -5.9845, timezone: 'Europe/Madrid' },
  { city: 'Valencia', country: 'Spain', latitude: 39.4699, longitude: -0.3763, timezone: 'Europe/Madrid' },
  { city: 'Málaga', country: 'Spain', latitude: 36.7213, longitude: -4.4214, timezone: 'Europe/Madrid' },
  { city: 'Figueres', country: 'Spain', latitude: 42.2665, longitude: 2.9616, timezone: 'Europe/Madrid' },
  { city: 'Lisbon', country: 'Portugal', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon' },
  { city: 'Porto', country: 'Portugal', latitude: 41.1579, longitude: -8.6291, timezone: 'Europe/Lisbon' },
  { city: 'Funchal', country: 'Portugal', latitude: 32.6669, longitude: -16.9241, timezone: 'Atlantic/Madeira' },
  { city: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens', isHistorical: true },
  { city: 'Thessaloniki', country: 'Greece', latitude: 40.6401, longitude: 22.9444, timezone: 'Europe/Athens' },
  { city: 'Prague', country: 'Czech Republic', latitude: 50.0755, longitude: 14.4378, timezone: 'Europe/Prague' },
  { city: 'Příbor', country: 'Czech Republic', latitude: 49.6389, longitude: 18.1444, timezone: 'Europe/Prague' },
  { city: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw' },
  { city: 'Krakow', country: 'Poland', latitude: 50.0647, longitude: 19.9450, timezone: 'Europe/Warsaw' },
  { city: 'Gdańsk', country: 'Poland', latitude: 54.3520, longitude: 18.6466, timezone: 'Europe/Warsaw' },
  { city: 'Budapest', country: 'Hungary', latitude: 47.4979, longitude: 19.0402, timezone: 'Europe/Budapest' },
  { city: 'Bucharest', country: 'Romania', latitude: 44.4268, longitude: 26.1025, timezone: 'Europe/Bucharest' },
  { city: 'Smiljan', country: 'Croatia', latitude: 44.5667, longitude: 15.3167, timezone: 'Europe/Zagreb', isHistorical: true },
  { city: 'Zagreb', country: 'Croatia', latitude: 45.8150, longitude: 15.9819, timezone: 'Europe/Zagreb' },
  { city: 'Donji Kraljevec', country: 'Croatia', latitude: 46.3667, longitude: 16.6500, timezone: 'Europe/Zagreb' },
  { city: 'Belgrade', country: 'Serbia', latitude: 44.7866, longitude: 20.4489, timezone: 'Europe/Belgrade' },
  { city: 'Stockholm', country: 'Sweden', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm' },
  { city: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo' },
  { city: 'Copenhagen', country: 'Denmark', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen' },
  { city: 'Helsinki', country: 'Finland', latitude: 60.1699, longitude: 24.9384, timezone: 'Europe/Helsinki' },
  { city: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { city: 'Kyiv', country: 'Ukraine', latitude: 50.4501, longitude: 30.5234, timezone: 'Europe/Kyiv' },
  { city: 'Dnipro', country: 'Ukraine', latitude: 48.4647, longitude: 35.0462, timezone: 'Europe/Kyiv' },
  { city: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
  { city: 'Saint Petersburg', country: 'Russia', latitude: 59.9343, longitude: 30.3351, timezone: 'Europe/Moscow' },

  // --- India & South Asia ---
  { city: 'New Delhi', adminCode: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { city: 'Delhi', adminCode: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata' },
  { city: 'Gurugram', adminCode: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, timezone: 'Asia/Kolkata' },
  { city: 'Gurgaon', adminCode: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, timezone: 'Asia/Kolkata' },
  { city: 'Noida', adminCode: 'Uttar Pradesh', country: 'India', latitude: 28.5355, longitude: 77.3910, timezone: 'Asia/Kolkata' },
  { city: 'Greater Noida', adminCode: 'Uttar Pradesh', country: 'India', latitude: 28.4744, longitude: 77.5040, timezone: 'Asia/Kolkata' },
  { city: 'Ghaziabad', adminCode: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538, timezone: 'Asia/Kolkata' },
  { city: 'Faridabad', adminCode: 'Haryana', country: 'India', latitude: 28.4089, longitude: 77.3178, timezone: 'Asia/Kolkata' },
  { city: 'Chandigarh', adminCode: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' },
  { city: 'Mumbai', adminCode: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { city: 'Navi Mumbai', adminCode: 'Maharashtra', country: 'India', latitude: 19.0330, longitude: 73.0297, timezone: 'Asia/Kolkata' },
  { city: 'Thane', adminCode: 'Maharashtra', country: 'India', latitude: 19.2183, longitude: 72.9781, timezone: 'Asia/Kolkata' },
  { city: 'Bengaluru', adminCode: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { city: 'Bangalore', adminCode: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { city: 'Kolkata', adminCode: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { city: 'Chennai', adminCode: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { city: 'Hyderabad', adminCode: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { city: 'Ahmedabad', adminCode: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { city: 'Pune', adminCode: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { city: 'Jaipur', adminCode: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', isHistorical: true },
  { city: 'Indore', adminCode: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' },
  { city: 'Bhopal', adminCode: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
  { city: 'Nagpur', adminCode: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata' },
  { city: 'Kochi', adminCode: 'Kerala', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
  { city: 'Visakhapatnam', adminCode: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' },
  { city: 'Varanasi', adminCode: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata', isHistorical: true },
  { city: 'Ujjain', adminCode: 'Madhya Pradesh', country: 'India', latitude: 23.1765, longitude: 75.7885, timezone: 'Asia/Kolkata', isHistorical: true },
  { city: 'Allahabad', adminCode: 'Uttar Pradesh', country: 'India', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' },
  { city: 'Prayagraj', adminCode: 'Uttar Pradesh', country: 'India', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' },
  { city: 'Gorakhpur', adminCode: 'Uttar Pradesh', country: 'India', latitude: 26.7606, longitude: 83.3732, timezone: 'Asia/Kolkata' },
  { city: 'Porbandar', adminCode: 'Gujarat', country: 'India', latitude: 21.6417, longitude: 69.6293, timezone: 'Asia/Kolkata' },
  { city: 'Madanapalle', adminCode: 'Andhra Pradesh', country: 'India', latitude: 13.5500, longitude: 78.5000, timezone: 'Asia/Kolkata' },
  { city: 'Tiruchuli', adminCode: 'Tamil Nadu', country: 'India', latitude: 9.5333, longitude: 78.2000, timezone: 'Asia/Kolkata' },
  { city: 'Haridwar', adminCode: 'Uttarakhand', country: 'India', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata' },
  { city: 'Rishikesh', adminCode: 'Uttarakhand', country: 'India', latitude: 30.0869, longitude: 78.2676, timezone: 'Asia/Kolkata' },
  { city: 'Lucknow', adminCode: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
  { city: 'Kanpur', adminCode: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata' },
  { city: 'Agra', adminCode: 'Uttar Pradesh', country: 'India', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' },
  { city: 'Meerut', adminCode: 'Uttar Pradesh', country: 'India', latitude: 28.9845, longitude: 77.7064, timezone: 'Asia/Kolkata' },
  { city: 'Bareilly', adminCode: 'Uttar Pradesh', country: 'India', latitude: 28.3670, longitude: 79.4304, timezone: 'Asia/Kolkata' },
  { city: 'Aligarh', adminCode: 'Uttar Pradesh', country: 'India', latitude: 27.8974, longitude: 78.0880, timezone: 'Asia/Kolkata' },
  { city: 'Patna', adminCode: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' },
  { city: 'Gaya', adminCode: 'Bihar', country: 'India', latitude: 24.7914, longitude: 85.0002, timezone: 'Asia/Kolkata', isHistorical: true },
  { city: 'Muzaffarpur', adminCode: 'Bihar', country: 'India', latitude: 26.1209, longitude: 85.3647, timezone: 'Asia/Kolkata' },
  { city: 'Bhagalpur', adminCode: 'Bihar', country: 'India', latitude: 25.2425, longitude: 86.9842, timezone: 'Asia/Kolkata' },
  { city: 'Jamshedpur', adminCode: 'Jharkhand', country: 'India', latitude: 22.8015, longitude: 86.2030, timezone: 'Asia/Kolkata' },
  { city: 'Ranchi', adminCode: 'Jharkhand', country: 'India', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' },
  { city: 'Dhanbad', adminCode: 'Jharkhand', country: 'India', latitude: 23.7957, longitude: 86.4304, timezone: 'Asia/Kolkata' },
  { city: 'Bokaro', adminCode: 'Jharkhand', country: 'India', latitude: 23.6693, longitude: 86.1511, timezone: 'Asia/Kolkata' },
  { city: 'Amritsar', adminCode: 'Punjab', country: 'India', latitude: 31.6340, longitude: 74.8723, timezone: 'Asia/Kolkata' },
  { city: 'Ludhiana', adminCode: 'Punjab', country: 'India', latitude: 30.9010, longitude: 75.8573, timezone: 'Asia/Kolkata' },
  { city: 'Jalandhar', adminCode: 'Punjab', country: 'India', latitude: 31.3260, longitude: 75.5762, timezone: 'Asia/Kolkata' },
  { city: 'Surat', adminCode: 'Gujarat', country: 'India', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
  { city: 'Vadodara', adminCode: 'Gujarat', country: 'India', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata' },
  { city: 'Rajkot', adminCode: 'Gujarat', country: 'India', latitude: 22.3039, longitude: 70.8022, timezone: 'Asia/Kolkata' },
  { city: 'Bhavnagar', adminCode: 'Gujarat', country: 'India', latitude: 21.7645, longitude: 72.1519, timezone: 'Asia/Kolkata' },
  { city: 'Jamnagar', adminCode: 'Gujarat', country: 'India', latitude: 22.4707, longitude: 70.0577, timezone: 'Asia/Kolkata' },
  { city: 'Nashik', adminCode: 'Maharashtra', country: 'India', latitude: 19.9975, longitude: 73.7898, timezone: 'Asia/Kolkata' },
  { city: 'Aurangabad', adminCode: 'Maharashtra', country: 'India', latitude: 19.8762, longitude: 75.3433, timezone: 'Asia/Kolkata' },
  { city: 'Chhatrapati Sambhajinagar', adminCode: 'Maharashtra', country: 'India', latitude: 19.8762, longitude: 75.3433, timezone: 'Asia/Kolkata' },
  { city: 'Solapur', adminCode: 'Maharashtra', country: 'India', latitude: 17.6599, longitude: 75.9064, timezone: 'Asia/Kolkata' },
  { city: 'Kolhapur', adminCode: 'Maharashtra', country: 'India', latitude: 16.7050, longitude: 74.2433, timezone: 'Asia/Kolkata' },
  { city: 'Gwalior', adminCode: 'Madhya Pradesh', country: 'India', latitude: 26.2183, longitude: 78.1828, timezone: 'Asia/Kolkata' },
  { city: 'Jabalpur', adminCode: 'Madhya Pradesh', country: 'India', latitude: 23.1815, longitude: 79.9864, timezone: 'Asia/Kolkata' },
  { city: 'Raipur', adminCode: 'Chhattisgarh', country: 'India', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' },
  { city: 'Bilaspur', adminCode: 'Chhattisgarh', country: 'India', latitude: 22.0797, longitude: 82.1409, timezone: 'Asia/Kolkata' },
  { city: 'Bhubaneswar', adminCode: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' },
  { city: 'Cuttack', adminCode: 'Odisha', country: 'India', latitude: 20.4625, longitude: 85.8828, timezone: 'Asia/Kolkata' },
  { city: 'Rourkela', adminCode: 'Odisha', country: 'India', latitude: 22.2604, longitude: 84.8536, timezone: 'Asia/Kolkata' },
  { city: 'Puri', adminCode: 'Odisha', country: 'India', latitude: 19.8135, longitude: 85.8312, timezone: 'Asia/Kolkata', isHistorical: true },
  { city: 'Guwahati', adminCode: 'Assam', country: 'India', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' },
  { city: 'Shillong', adminCode: 'Meghalaya', country: 'India', latitude: 25.5788, longitude: 91.8933, timezone: 'Asia/Kolkata' },
  { city: 'Dehradun', adminCode: 'Uttarakhand', country: 'India', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' },
  { city: 'Shimla', adminCode: 'Himachal Pradesh', country: 'India', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata' },
  { city: 'Jammu', adminCode: 'Jammu and Kashmir', country: 'India', latitude: 32.7266, longitude: 74.8570, timezone: 'Asia/Kolkata' },
  { city: 'Srinagar', adminCode: 'Jammu and Kashmir', country: 'India', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
  { city: 'Coimbatore', adminCode: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
  { city: 'Madurai', adminCode: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
  { city: 'Tiruchirappalli', adminCode: 'Tamil Nadu', country: 'India', latitude: 10.7905, longitude: 78.7047, timezone: 'Asia/Kolkata' },
  { city: 'Salem', adminCode: 'Tamil Nadu', country: 'India', latitude: 11.6643, longitude: 78.1460, timezone: 'Asia/Kolkata' },
  { city: 'Tirunelveli', adminCode: 'Tamil Nadu', country: 'India', latitude: 8.7139, longitude: 77.7567, timezone: 'Asia/Kolkata' },
  { city: 'Vijayawada', adminCode: 'Andhra Pradesh', country: 'India', latitude: 16.5062, longitude: 80.6480, timezone: 'Asia/Kolkata' },
  { city: 'Guntur', adminCode: 'Andhra Pradesh', country: 'India', latitude: 16.3067, longitude: 80.4365, timezone: 'Asia/Kolkata' },
  { city: 'Tirupati', adminCode: 'Andhra Pradesh', country: 'India', latitude: 13.6288, longitude: 79.4192, timezone: 'Asia/Kolkata' },
  { city: 'Warangal', adminCode: 'Telangana', country: 'India', latitude: 17.9689, longitude: 79.5941, timezone: 'Asia/Kolkata' },
  { city: 'Kozhikode', adminCode: 'Kerala', country: 'India', latitude: 11.2588, longitude: 75.7804, timezone: 'Asia/Kolkata' },
  { city: 'Thiruvananthapuram', adminCode: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' },
  { city: 'Thrissur', adminCode: 'Kerala', country: 'India', latitude: 10.5276, longitude: 76.2144, timezone: 'Asia/Kolkata' },
  { city: 'Mangalore', adminCode: 'Karnataka', country: 'India', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata' },
  { city: 'Mysore', adminCode: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
  { city: 'Hubli', adminCode: 'Karnataka', country: 'India', latitude: 15.3647, longitude: 75.1240, timezone: 'Asia/Kolkata' },
  { city: 'Belgaum', adminCode: 'Karnataka', country: 'India', latitude: 15.8497, longitude: 74.4977, timezone: 'Asia/Kolkata' },
  { city: 'Colombo', country: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezone: 'Asia/Colombo' },
  { city: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 'Asia/Dhaka' },
  { city: 'Kathmandu', country: 'Nepal', latitude: 27.7172, longitude: 85.3240, timezone: 'Asia/Kathmandu' },
  { city: 'Thimphu', country: 'Bhutan', latitude: 27.4728, longitude: 89.6393, timezone: 'Asia/Thimphu' },
  { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { city: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi' },
  { city: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },

  // --- East & Southeast Asia ---
  { city: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai', isHistorical: true },
  { city: 'Shanghai', country: 'China', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai' },
  { city: 'Guangzhou', country: 'China', latitude: 23.1291, longitude: 113.2644, timezone: 'Asia/Shanghai' },
  { city: 'Shenzhen', country: 'China', latitude: 22.5431, longitude: 114.0579, timezone: 'Asia/Shanghai' },
  { city: 'Chengdu', country: 'China', latitude: 30.5728, longitude: 104.0668, timezone: 'Asia/Shanghai' },
  { city: 'Xi’an', country: 'China', latitude: 34.3416, longitude: 108.9398, timezone: 'Asia/Shanghai', isHistorical: true },
  { city: 'Hangzhou', country: 'China', latitude: 30.2741, longitude: 120.1551, timezone: 'Asia/Shanghai' },
  { city: 'Nanjing', country: 'China', latitude: 32.0603, longitude: 118.7969, timezone: 'Asia/Shanghai', isHistorical: true },
  { city: 'Lhasa', country: 'China', latitude: 29.6525, longitude: 91.1721, timezone: 'Asia/Shanghai', isHistorical: true },
  { city: 'Taktser', country: 'China', latitude: 36.3778, longitude: 101.8656, timezone: 'Asia/Shanghai', isHistorical: true },
  { city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong' },
  { city: 'Taipei', country: 'Taiwan', latitude: 25.0330, longitude: 121.5654, timezone: 'Asia/Taipei' },
  { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { city: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681, timezone: 'Asia/Tokyo', isHistorical: true },
  { city: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo' },
  { city: 'Seoul', country: 'South Korea', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul' },
  { city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { city: 'Bali', country: 'Indonesia', latitude: -8.3405, longitude: 115.0920, timezone: 'Asia/Makassar' },
  { city: 'Manila', country: 'Philippines', latitude: 14.5995, longitude: 120.9842, timezone: 'Asia/Manila' },
  { city: 'Hanoi', country: 'Vietnam', latitude: 21.0285, longitude: 105.8542, timezone: 'Asia/Ho_Chi_Minh' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', latitude: 10.8231, longitude: 106.6297, timezone: 'Asia/Ho_Chi_Minh' },

  // --- Middle East & North Africa ---
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', isHistorical: true },
  { city: 'Alexandria', country: 'Egypt', latitude: 31.2001, longitude: 29.9187, timezone: 'Africa/Cairo', isHistorical: true },
  { city: 'Luxor', country: 'Egypt', latitude: 25.6872, longitude: 32.6396, timezone: 'Africa/Cairo', isHistorical: true },
  { city: 'Dendera', country: 'Egypt', latitude: 26.1667, longitude: 32.6667, timezone: 'Africa/Cairo', isHistorical: true },
  { city: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661, timezone: 'Asia/Baghdad', isHistorical: true },
  { city: 'Basra', country: 'Iraq', latitude: 30.5081, longitude: 47.7835, timezone: 'Asia/Baghdad', isHistorical: true },
  { city: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765, timezone: 'Asia/Damascus', isHistorical: true },
  { city: 'Jerusalem', country: 'Israel', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Jerusalem', isHistorical: true },
  { city: 'Tel Aviv', country: 'Israel', latitude: 32.0853, longitude: 34.7818, timezone: 'Asia/Jerusalem' },
  { city: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018, timezone: 'Asia/Beirut' },
  { city: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284, timezone: 'Asia/Amman' },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', isHistorical: true },
  { city: 'Ankara', country: 'Turkey', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul' },
  { city: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890, timezone: 'Asia/Tehran' },
  { city: 'Isfahan', country: 'Iran', latitude: 32.6546, longitude: 51.6680, timezone: 'Asia/Tehran', isHistorical: true },
  { city: 'Shiraz', country: 'Iran', latitude: 29.5918, longitude: 52.5837, timezone: 'Asia/Tehran', isHistorical: true },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
  { city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
  { city: 'Mecca', country: 'Saudi Arabia', latitude: 21.3891, longitude: 39.8579, timezone: 'Asia/Riyadh', isHistorical: true },
  { city: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh', isHistorical: true },
  { city: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar' },
  { city: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
  { city: 'Marrakech', country: 'Morocco', latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca' },
  { city: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis' },
  { city: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers' },

  // --- Sub-Saharan Africa ---
  { city: 'Johannesburg', country: 'South Africa', latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg' },
  { city: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
  { city: 'Pretoria', country: 'South Africa', latitude: -25.7479, longitude: 28.2293, timezone: 'Africa/Johannesburg' },
  { city: 'Bloemfontein', country: 'South Africa', latitude: -29.1183, longitude: 26.2249, timezone: 'Africa/Johannesburg' },
  { city: 'Mvezo', country: 'South Africa', latitude: -31.9547, longitude: 28.5133, timezone: 'Africa/Johannesburg', isHistorical: true },
  { city: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi' },
  { city: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos' },
  { city: 'Accra', country: 'Ghana', latitude: 5.6037, longitude: -0.1870, timezone: 'Africa/Accra' },
  { city: 'Addis Ababa', country: 'Ethiopia', latitude: 9.0300, longitude: 38.7400, timezone: 'Africa/Addis_Ababa' },
  { city: 'Stone Town', country: 'Tanzania', latitude: -6.1659, longitude: 39.1994, timezone: 'Africa/Dar_es_Salaam' },
  { city: 'Dar es Salaam', country: 'Tanzania', latitude: -6.7924, longitude: 39.2083, timezone: 'Africa/Dar_es_Salaam' },
  { city: 'Sherwood Content', country: 'Jamaica', latitude: 18.2917, longitude: -77.6250, timezone: 'America/Jamaica' },
  { city: 'Kingston', country: 'Jamaica', latitude: 17.9712, longitude: -76.7928, timezone: 'America/Jamaica' },

  // --- Oceania: Australia, New Zealand & Polynesia ---
  { city: 'Sydney', adminCode: 'NSW', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { city: 'Melbourne', adminCode: 'VIC', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
  { city: 'Brisbane', adminCode: 'QLD', country: 'Australia', latitude: -27.4698, longitude: 153.0251, timezone: 'Australia/Brisbane' },
  { city: 'Perth', adminCode: 'WA', country: 'Australia', latitude: -31.9505, longitude: 115.8605, timezone: 'Australia/Perth' },
  { city: 'Adelaide', adminCode: 'SA', country: 'Australia', latitude: -34.9285, longitude: 138.6007, timezone: 'Australia/Adelaide' },
  { city: 'Canberra', adminCode: 'ACT', country: 'Australia', latitude: -35.2809, longitude: 149.1300, timezone: 'Australia/Canberra' },
  { city: 'Auckland', country: 'New Zealand', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland' },
  { city: 'Wellington', country: 'New Zealand', latitude: -41.2865, longitude: 174.7762, timezone: 'Pacific/Auckland' },
  { city: 'Christchurch', country: 'New Zealand', latitude: -43.5321, longitude: 172.6362, timezone: 'Pacific/Auckland' },
  { city: 'Rotorua', country: 'New Zealand', latitude: -38.1368, longitude: 176.2497, timezone: 'Pacific/Auckland', isHistorical: true },
  { city: 'Papeete', country: 'French Polynesia', latitude: -17.5350, longitude: -149.5696, timezone: 'Pacific/Tahiti' },
  { city: 'Suva', country: 'Fiji', latitude: -18.1416, longitude: 178.4419, timezone: 'Pacific/Fiji' },
  { city: 'Apia', country: 'Samoa', latitude: -13.8333, longitude: -171.7667, timezone: 'Pacific/Apia' },
  { city: 'Nukuʻalofa', country: 'Tonga', latitude: -21.1394, longitude: -175.2049, timezone: 'Pacific/Tongatapu' }
];

/**
 * Normalizes text for case-insensitive diacritic-agnostic comparison.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Searches the local gazetteer for matching cities.
 * Results prioritized by exact prefix match, then substring match.
 */
export function getMatchingCities(query: string, limit = 8): CityRecord[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = normalizeText(query);
  const prefixMatches: CityRecord[] = [];
  const substringMatches: CityRecord[] = [];

  for (const c of WORLD_CITIES) {
    const normCity = normalizeText(c.city);
    const normCountry = normalizeText(c.country);
    const normAdmin = c.adminCode ? normalizeText(c.adminCode) : '';

    if (normCity.startsWith(cleanQuery)) {
      prefixMatches.push(c);
    } else if (
      normCity.includes(cleanQuery) ||
      normCountry.startsWith(cleanQuery) ||
      normCountry.includes(cleanQuery) ||
      normAdmin.startsWith(cleanQuery)
    ) {
      substringMatches.push(c);
    }

    if (prefixMatches.length >= limit) {
      return prefixMatches.slice(0, limit);
    }
  }

  return [...prefixMatches, ...substringMatches].slice(0, limit);
}
