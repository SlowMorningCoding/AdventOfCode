"""
Utility functions for Advent of Code 2025.
"""

from pathlib import Path
from typing import List, Optional


def read_input_file(filename: str) -> str:
    """Read input file from inputs/ directory."""
    input_path = Path(__file__).parent.parent / "inputs" / filename
    if input_path.exists():
        return input_path.read_text().strip()
    raise FileNotFoundError(f"Input file not found: {filename}")


def read_lines(filename: str) -> List[str]:
    """Read input file and return as list of lines."""
    content = read_input_file(filename)
    return content.split("\n")


def read_groups(filename: str, separator: str = "\n\n") -> List[str]:
    """Read input file and split by separator."""
    content = read_input_file(filename)
    return content.split(separator)


def input_path_for_day(day: int, filename: Optional[str] = None, test: bool = False) -> Path:
    """Return the `Path` for the given day's input file.

    If `filename` is provided it will be used directly. Otherwise the function
    will choose `input_day{day}_test.txt` when `test=True` or
    `input_day{day}.txt` when `test=False`.
    """
    inputs_dir = Path(__file__).parent.parent / "inputs"
    if filename:
        return inputs_dir / filename
    name = f"input_day{day}_test.txt" if test else f"input_day{day}.txt"
    return inputs_dir / name


def load_input(day: int, filename: Optional[str] = None, test: bool = False) -> str:
    """Load input content for a given day.

    - `day`: day number (1-25)
    - `filename`: optional explicit filename inside `inputs/`
    - `test`: if True, prefer the test filename

    Raises `FileNotFoundError` if the chosen input file does not exist.
    """
    path = input_path_for_day(day, filename=filename, test=test)
    if path.exists():
        return path.read_text().strip()

    # If test mode requested but test file doesn't exist, try the real input
    if test:
        fallback = input_path_for_day(day, filename=filename, test=False)
        if fallback.exists():
            return fallback.read_text().strip()

    raise FileNotFoundError(f"Input file not found: {path}")
