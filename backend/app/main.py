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
            gender=req.gender
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
            gender=req.gender
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
            astro_base, jyotisha, bazi, western, ziwei, mayan, tibetan, verification_report, audit
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

