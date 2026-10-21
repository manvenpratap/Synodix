"""
Regression suite bridge connecting classical astrological calculation engines
and simulation tests into the root test harness.
"""

from backend.tests.test_engine import test_six_culture_pipeline
from backend.tests.test_simulation_personalities import (
    test_simulation_dataset_integrity,
    test_100_personalities_dataset_integrity,
)


def test_suite_classical_astrological_engines():
    """Execute complete 6-tradition & 9-tradition deterministic calculation checks."""
    test_six_culture_pipeline()


def test_suite_simulations_and_personalities():
    """Verify 10 and 100 historical personalities simulation benchmarks."""
    test_simulation_dataset_integrity()
    test_100_personalities_dataset_integrity()
