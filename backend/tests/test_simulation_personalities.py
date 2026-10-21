"""
Test suite validating the 10-personality simulation results against core biographical invariants.
Ensures reproducible cross-cultural synthesis, divergence rate calculations, and timing alignments.
"""

import json
from pathlib import Path

def test_simulation_dataset_integrity():
    data_path = Path("/Users/manvenpratapsingh/.gemini/antigravity/brain/7e00f5b0-1930-40fb-83e1-b1438716a830/scratch/simulation_results.json")
    assert data_path.exists(), "Simulation results file must exist"
    
    with open(data_path) as f:
        results = json.load(f)
    
    assert len(results) == 10, f"Expected 10 personalities, got {len(results)}"
    
    # 1. Verify key figures and specific astrological-biographical anchors
    ali = next(p for p in results if p["profile"]["id"] == "muhammad_ali")
    assert "Ruchaka Yoga" in ali["jyotisha"]["yogas"], "Muhammad Ali must have Ruchaka Yoga"
    assert "庚 (Metal Yang)" in ali["bazi"]["day_master"], "Ali Day Master must be Geng Yang Metal"
    
    gates = next(p for p in results if p["profile"]["id"] == "bill_gates")
    assert "Sasa Yoga" in gates["jyotisha"]["yogas"], "Bill Gates must have Sasa Yoga"
    assert "Dhana Yoga" in gates["jyotisha"]["yogas"], "Bill Gates must have Dhana Yoga"
    
    einstein = next(p for p in results if p["profile"]["id"] == "albert_einstein")
    assert "Budhaditya Yoga" in einstein["jyotisha"]["yogas"], "Einstein must have Budhaditya Yoga"
    assert len(einstein["jyotisha"]["yogas"]) >= 4, "Einstein must have at least 4 classical yogas"
    
    elizabeth = next(p for p in results if p["profile"]["id"] == "queen_elizabeth_ii")
    assert elizabeth["synthesis"]["domain_results"]["D2"]["grade"] == "STRONG", "Queen Elizabeth D2 Career must be STRONG consensus"
    
    kahlo = next(p for p in results if p["profile"]["id"] == "frida_kahlo")
    assert kahlo["synthesis"]["domain_results"]["D2"]["grade"] == "STRONG", "Frida Kahlo D2 Career must be STRONG consensus"
    assert kahlo["synthesis"]["domain_results"]["D7"]["j_pol"] == "Challenging", "Frida Kahlo Jyotisha D7 must be Challenging"
    
    # 2. Verify divergence rates
    div_rates = [p["synthesis"]["divergence_rate_percent"] for p in results]
    mean_div = sum(div_rates) / len(div_rates)
    assert 20.0 <= mean_div <= 30.0, f"Expected mean divergence ~26.6%, got {mean_div}%"
    
    print(f"[PASS] 10 Personalities simulation verified with mean divergence rate: {mean_div:.1f}%.")

def test_100_personalities_dataset_integrity():
    data_100_path = Path("backend/app/data/personalities_100.json")
    assert data_100_path.exists(), "100 Personalities data file must exist"
    
    with open(data_100_path) as f:
        personalities = json.load(f)
    assert len(personalities) == 100, f"Expected 100 personalities, got {len(personalities)}"
    
    # Verify categories
    categories = {p["category"] for p in personalities}
    expected_categories = {"science_tech", "leaders_statesmen", "arts_music_lit", "philosophy_spirituality", "sports_athletics", "cinema_business"}
    assert categories == expected_categories, f"Category mismatch: {categories} != {expected_categories}"
    
    sim_100_path = Path("/Users/manvenpratapsingh/.gemini/antigravity/brain/7e00f5b0-1930-40fb-83e1-b1438716a830/scratch/simulation_100_results.json")
    assert sim_100_path.exists(), "100-Personality simulation results must exist"
    
    with open(sim_100_path) as f:
        results = json.load(f)
    assert len(results) == 100, f"Expected 100 simulation results, got {len(results)}"
    
    # Verify key titan charts in the 100 dataset
    einstein = next(p for p in results if p["profile"]["id"] == "albert-einstein")
    assert "Budhaditya Yoga" in einstein["jyotisha"]["yogas"]
    
    ali = next(p for p in results if p["profile"]["id"] == "muhammad-ali")
    assert "Ruchaka Yoga" in ali["jyotisha"]["yogas"]
    
    mean_div = sum(p["synthesis"]["divergence_rate_percent"] for p in results) / len(results)
    assert 28.0 <= mean_div <= 35.0, f"Expected mean divergence ~31.8%, got {mean_div:.2f}%"
    
    print(f"[PASS] 100 Personalities benchmark verified: 100/100 charts simulated, mean divergence: {mean_div:.1f}%.")

if __name__ == "__main__":
    test_simulation_dataset_integrity()
    test_100_personalities_dataset_integrity()
