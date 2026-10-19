export interface BirthInput {
  birth_date: string;
  birth_time: string;
  time_certainty: 'exact' | 'rounded_15' | 'approx_30' | 'unknown';
  custom_uncertainty_mins?: number | null;
  latitude: number;
  longitude: number;
  city_name: string;
  country_name: string;
  gender: 'male' | 'female' | 'neutral';
}

export interface Preset {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  time_certainty: 'exact' | 'rounded_15' | 'approx_30' | 'unknown';
  latitude: number;
  longitude: number;
  city_name: string;
  country_name: string;
  gender: 'male' | 'female' | 'neutral';
  note: string;
}

export interface DualEngineDiff {
  body: string;
  primary_engine: string;
  primary_value_deg: number;
  validator: string;
  validator_value_deg: number;
  difference_deg: number;
  difference_arcsec: number;
  tolerance_deg: number;
  status: 'pass' | 'alert' | 'unavailable';
  confidence: 'high' | 'medium' | 'low';
}

export interface InvariantItem {
  system: string;
  description: string;
  expected: string | number;
  actual: string | number;
  status: 'PASS' | 'FAIL' | 'ALERT';
}

export interface VerificationReport {
  overall_verification_status: 'PASS' | 'ALERT';
  overall_confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  dual_engine_diffs: DualEngineDiff[];
  max_planetary_difference_deg: number;
  invariants: InvariantItem[];
  time_boundary_sensitivity: {
    ascendant_near_cusp: boolean;
    asc_cusp_distance_deg: number;
    bazi_two_hour_boundary_mins: number;
  };
}

export interface DomainEvaluation {
  cluster: string;
  prominence: 'High' | 'Medium' | 'Low';
  polarity: 'Positive' | 'Mixed' | 'Challenging';
  basis: string;
}

export interface DomainSynthesis {
  domain_id: string;
  domain_name: string;
  grade: 'STRONG' | 'MODERATE' | 'WEAK' | 'DIVERGENT' | 'INSUFFICIENT';
  is_divergent: boolean;
  consensus_theme: string;
  evaluations: {
    jyotisha: DomainEvaluation;
    western: DomainEvaluation;
    sinic: DomainEvaluation;
  };
}

export interface TemperamentAxis {
  axis_id: string;
  name: string;
  computed_base: string;
  symbolic_overlay: string;
  expression: string;
}

export interface Chronology {
  jyotisha_vimshottari: {
    active_mahadasha: string;
    span: string;
    activated_domain: string;
  };
  bazi_da_yun: {
    active_pillar: string;
    ten_god: string;
    start_age: number;
  };
  western_profection: {
    activated_house: number;
    lord_of_year: string;
    activated_domain: string;
  };
  ziwei_da_xian: {
    active_palace: string;
    age_span: string;
  };
  convergence_status: string;
}

export interface Synthesis {
  domain_results: Record<string, DomainSynthesis>;
  divergence_metrics: {
    total_domains: number;
    divergent_domains: number;
    strong_domains: number;
    moderate_domains: number;
    weak_domains: number;
    divergence_rate_percent: number;
  };
  temperament_axes: TemperamentAxis[];
  chronology: Chronology;
  final_reading_markdown: string;
}

export interface ChartResponse {
  birth_input_audit: any;
  uncertainty_classification: {
    tropical_ascendant: 'STABLE' | 'SENSITIVE';
    sidereal_ascendant: 'STABLE' | 'SENSITIVE';
    ensemble_alternatives: Array<{
      label: string;
      offset_minutes: number;
      tropical_asc_sign: string;
      sidereal_asc_sign: string;
    }>;
  };
  astronomical_base: any;
  traditions: {
    jyotisha: any;
    bazi: any;
    western: any;
    ziwei: any;
    mayan: any;
    tibetan: any;
  };
  verification_report: VerificationReport;
  synthesis: Synthesis;
  calculation_manifest: any;
}
