#!/usr/bin/env python3
"""
Main script to run Advent of Code 2025 solutions.
"""

import argparse
import sys
from pathlib import Path
from importlib import import_module


def run_day(day: int, test: bool = False) -> None:
    """Run solution for a specific day.

    If `test` is True, attempt to call the day's `solve(test=True)`; if the
    function does not accept that parameter, fall back to calling `solve()`.
    """
    try:
        module = import_module(f'src.day{day}')
        if hasattr(module, 'solve'):
            print(f"=== Day {day} {'(test)' if test else ''} ===")
            try:
                # Prefer calling with test kwarg when supported
                module.solve(test=test)  # type: ignore[call-arg]
            except TypeError:
                # Fallback to no-arg solve
                module.solve()
        else:
            print(f"Day {day} solution not yet implemented.")
    except ModuleNotFoundError:
        print(f"Solution for Day {day} not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error running Day {day}: {e}")
        sys.exit(1)


def run_all_days(test: bool = False) -> None:
    """Run all available solutions."""
    src_dir = Path(__file__).parent / 'src'
    if not src_dir.exists():
        print("src/ directory not found.")
        sys.exit(1)
    day_files = sorted(src_dir.glob('day*.py'))
    if not day_files:
        print("No solution files found in src/ directory.")
        sys.exit(1)
    for day_file in day_files:
        day_num = int(day_file.stem.replace('day', ''))
        try:
            run_day(day_num, test=test)
            print()
        except SystemExit:
            continue


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Run Advent of Code 2025 solutions'
    )
    parser.add_argument(
        '--day',
        type=int,
        help='Run specific day (1-25)'
    )
    parser.add_argument(
        '--test',
        action='store_true',
        help='Run solutions using test input data when available'
    )
    args = parser.parse_args()
    if args.day:
        if not 1 <= args.day <= 25:
            print("Day must be between 1 and 25.")
            sys.exit(1)
        run_day(args.day, test=args.test)
    else:
        run_all_days(test=args.test)


if __name__ == '__main__':
    main()
