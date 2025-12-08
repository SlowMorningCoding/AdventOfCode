"""
Utility functions for Advent of Code 2025.
"""

from pathlib import Path
from typing import List

def read_input_file(filename: str) -> str:
    """Read input file from inputs/ directory."""
    input_path = Path(__file__).parent.parent / 'inputs' / filename
    if input_path.exists():
        return input_path.read_text().strip()
    raise FileNotFoundError(f"Input file not found: {filename}")

def read_lines(filename: str) -> List[str]:
    """Read input file and return as list of lines."""
    content = read_input_file(filename)
    return content.split('\n')

def read_groups(filename: str, separator: str = '\n\n') -> List[str]:
    """Read input file and split by separator."""
    content = read_input_file(filename)
    return content.split(separator)
