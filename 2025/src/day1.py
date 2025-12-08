"""
Day 1: [Puzzle Title]
https://adventofcode.com/2025/day/1
"""

from pathlib import Path

def read_input(filename: str = 'input_day1.txt') -> str:
    """Read input file."""
    input_path = Path(__file__).parent.parent / 'inputs' / filename
    if input_path.exists():
        return input_path.read_text().strip()
    return ""

def part1(data: str) -> int:
    """Solve part 1."""
    # TODO: Implement part 1
    return 0

def part2(data: str) -> int:
    """Solve part 2."""
    # TODO: Implement part 2
    return 0

def solve() -> None:
    """Solve day 1."""
    data = read_input()
    
    if not data:
        print("Input file not found. Please add input_day1.txt to inputs/ folder.")
        return
    
    result1 = part1(data)
    result2 = part2(data)
    
    print(f"Part 1: {result1}")
    print(f"Part 2: {result2}")

if __name__ == '__main__':
    solve()
