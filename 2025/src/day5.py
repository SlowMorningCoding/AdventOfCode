"""
https://adventofcode.com/2025/day/5

--- Day 5: Cafeteria ---

As the forklifts break through the wall, the Elves are delighted to
discover that there was a cafeteria on the other side after all.

You can hear a commotion coming from the kitchen. "At this rate, we won't
have any time left to put the wreaths up in the dining hall!" Resolute in
your quest, you investigate.

"If only we hadn't switched to the new inventory management system right
before Christmas!" another Elf exclaims. You ask what's going on.

The Elves in the kitchen explain the situation: because of their
complicated new inventory management system, they can't figure out which of
their ingredients are fresh and which are spoiled. When you ask how it
works, they give you a copy of their database (your puzzle input).

The database operates on ingredient IDs. It consists of a list of fresh
ingredient ID ranges, a blank line, and a list of available ingredient IDs.
For example:

3-5
10-14
16-20
12-18

1
5
8
11
17
32

The fresh ID ranges are inclusive: the range 3-5 means that ingredient IDs
3, 4, and 5 are all fresh. The ranges can also overlap; an ingredient ID is
fresh if it is in any range.

The Elves are trying to determine which of the available ingredient IDs are
fresh. In this example, this is done as follows:

Ingredient ID 1 is spoiled because it does not fall into any range.
Ingredient ID 5 is fresh because it falls into range 3-5.
Ingredient ID 8 is spoiled.
Ingredient ID 11 is fresh because it falls into range 10-14.
Ingredient ID 17 is fresh because it falls into range 16-20 as well as
range 12-18.
Ingredient ID 32 is spoiled.
So, in this example, 3 of the available ingredient IDs are fresh.

Process the database file from the new inventory management system. How
many of the available ingredient IDs are fresh?

--- Solution ---

Your puzzle answer was 525.

--- Part Two ---
The Elves start bringing their spoiled inventory to the trash chute at the
back of the kitchen.

So that they can stop bugging you when they get new inventory, the Elves
would like to know all of the IDs that the fresh ingredient ID ranges
consider to be fresh. An ingredient ID is still considered fresh if it is
in any range.

Now, the second section of the database (the available ingredient IDs) is
irrelevant. Here are the fresh ingredient ID ranges from the above example:

3-5
10-14
16-20
12-18

The ingredient IDs that these ranges consider to be fresh are 3, 4, 5, 10,
11, 12, 13, 14, 15, 16, 17, 18, 19, and 20. So, in this example, the fresh
ingredient ID ranges consider a total of 14 ingredient IDs to be fresh.

Process the database file again. How many ingredient IDs are considered to
be fresh according to the fresh ingredient ID ranges?

--- Solution ---
Your puzzle answer was 333892124923577

"""

import warnings

from .utils import load_input


def log(str_msg: str) -> None:
    """Log a message to the console (for debugging)."""
    print(str_msg)


def _split_data(data: str) -> tuple[list[tuple[int, int]], list[int]]:
    """Split input data into list of ranges and available IDs."""
    fresh_ranges: list[tuple[int, int]] = []
    available_ids: list[int] = []
    lines = data.splitlines()
    separator_index = lines.index("")
    for line in lines[:separator_index]:
        start, end = map(int, line.split("-"))
        fresh_ranges.append((start, end))
    for line in lines[separator_index + 1 :]:
        available_ids.append(int(line))
    return fresh_ranges, available_ids


def _part1(data: str) -> int:
    """Solve part 1."""
    result = 0
    fresh_ranges, available_ids = _split_data(data)
    for ingredient_id in available_ids:
        for start, end in fresh_ranges:
            if start <= ingredient_id <= end:
                result += 1
                break
    return result


@warnings.deprecated("Use _part2 instead. This function is too heavy.")
def _part2_v1(data: str) -> int:
    """Solve part 2."""
    result = 0
    fresh_ranges, _ = _split_data(data)
    fresh_ids: set[int] = set()
    for start, end in fresh_ranges:
        for ingredient_id in range(start, end + 1):
            fresh_ids.add(ingredient_id)
    result = len(fresh_ids)
    return result


def _part2(data: str) -> int:
    """Solve part 2."""
    result = 0
    fresh_ranges, _ = _split_data(data)
    fresh_ranges.sort()
    merged_ranges: list[tuple[int, int]] = []
    for start, end in fresh_ranges:
        if not merged_ranges:
            merged_ranges.append((start, end))
            continue
        last_start, last_end = merged_ranges[-1]
        if start <= last_end + 1:
            merged_ranges[-1] = (last_start, max(last_end, end))
        else:
            merged_ranges.append((start, end))
    for start, end in merged_ranges:
        result += end - start + 1

    return result


def solve(test: bool = False) -> None:
    """Solve a day."""
    try:
        data = load_input(5, test=test)
    except FileNotFoundError as exc:
        missing = exc.args[0] if exc.args else "input file"
        print(f"Input file not found. Please add the appropriate input to inputs/ folder. ({missing})")
        return
    result1 = _part1(data)
    print(f"Part 1: {result1}")
    result2 = _part2(data)
    print(f"Part 2: {result2}")


if __name__ == "__main__":
    solve()
