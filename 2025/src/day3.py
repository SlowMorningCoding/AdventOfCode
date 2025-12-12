"""
https://adventofcode.com/2025/day/3

--- Day 3: Lobby ---

You descend a short staircase, enter the surprisingly vast lobby, and are
quickly cleared by the security checkpoint. When you get to the main
elevators, however, you discover that each one has a red light above it:
they're all offline.

"Sorry about that," an Elf apologizes as she tinkers with a nearby control
panel. "Some kind of electrical surge seems to have fried them. I'll try to
get them online soon."

You explain your need to get further underground. "Well, you could at least
take the escalator down to the printing department, not that you'd get much
further than that without the elevators working. That is, you could if the
escalator weren't also offline."

"But, don't worry! It's not fried; it just needs power. Maybe you can get
it running while I keep working on the elevators."

There are batteries nearby that can supply emergency power to the escalator
for just such an occasion. The batteries are each labeled with their
joltage rating, a value from 1 to 9. You make a note of their joltage
ratings (your puzzle input). For example:

987654321111111
811111111111119
234234234234278
818181911112111

The batteries are arranged into banks; each line of digits in your input
corresponds to a single bank of batteries. Within each bank, you need to
turn on exactly two batteries; the joltage that the bank produces is equal
to the number formed by the digits on the batteries you've turned on. For
example, if you have a bank like 12345 and you turn on batteries 2 and 4,
the bank would produce 24 jolts. (You cannot rearrange batteries.)

You'll need to find the largest possible joltage each bank can produce. In
the above example:

In 987654321111111, you can make the largest joltage possible, 98,
by turning on the first two batteries.
In 811111111111119, you can make the largest joltage possible by
turning on the batteries labeled 8 and 9, producing 89 jolts.
In 234234234234278, you can make 78 by turning on the last two
batteries (marked 7 and 8).
In 818181911112111, the largest joltage you can produce is 92.

The total output joltage is the sum of the maximum joltage from each bank,
so in this example, the total output joltage is 98 + 89 + 78 + 92 = 357.

There are many batteries in front of you. Find the maximum joltage possible
from each bank; what is the total output joltage?

--- Solution ---
Your puzzle answer was 17244.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---

The escalator doesn't move. The Elf explains that it probably needs more
joltage to overcome the static friction of the system and hits the big red
"joltage limit safety override" button. You lose count of the number of
times she needs to confirm "yes, I'm sure" and decorate the lobby a bit
while you wait.

Now, you need to make the largest joltage by turning on exactly twelve
batteries within each bank.

The joltage output for the bank is still the number formed by the digits of
the batteries you've turned on; the only difference is that now there will
be 12 digits in each bank's joltage output instead of two.

Consider again the example from before:

987654321111111
811111111111119
234234234234278
818181911112111

Now, the joltages are much larger:

In 987654321111111, the largest joltage can be found by turning on
everything except some 1s at the end to produce 987654321111.
In the digit sequence 811111111111119, the largest joltage can be
found by turning on everything except some 1s, producing 811111111119.
In 234234234234278, the largest joltage can be found by turning on
everything except a 2 battery, a 3 battery, and another 2 battery near
the start to produce 434234234278.
In 818181911112111, the joltage 888911112111 is produced by turning on
everything except some 1s near the front.
The total output joltage is now much larger: 987654321111 + 811111111119 +
434234234278 + 888911112111 = 3121910778619.

What is the new total output joltage?

--- Solution ---
Your puzzle answer was 171435596092638.
"""

import warnings

from .utils import load_input


def log(str_msg: str) -> None:
    """Log a message to the console (for debugging)."""
    print(str_msg)


def _split_data(data: str) -> list[str]:
    """Split input data into list of joltages"""
    entrys: list[str] = []
    for line in data.splitlines():
        line = line.strip()
        if not line:
            continue
        entrys.append(line)
    return entrys


def _part1(data: str) -> int:
    """Solve part 1."""
    result = 0
    for entry in _split_data(data):
        max_joltage = 0
        length = len(entry)
        for i in range(length):
            for j in range(i + 1, length):
                joltage = int(entry[i] + entry[j])
                if joltage > max_joltage:
                    max_joltage = joltage
        result += max_joltage
    return result


@warnings.deprecated("max_joltage_combination is deprecated, use an optimized approach instead.")
def max_joltage_combination_v1(entry: str, count: int) -> int:
    """Find the maximum joltage by turning on `count` batteries."""
    result = 0
    accumulate: list[int] = []
    length = len(entry)

    def backtrack(start: int) -> None:
        if len(accumulate) == count:
            joltage = int("".join(str(d) for d in accumulate))
            nonlocal result
            if joltage > result:
                result = joltage
            return
        for i in range(start, length):
            accumulate.append(int(entry[i]))
            backtrack(i + 1)
            accumulate.pop()

    backtrack(0)
    return result


def max_joltage_combination(entry: str, count: int) -> int:
    """Find the maximum joltage by turning on `count` batteries.
    find first highest digit while there is enaough digits left to reach count
    then repeat until count is reached.
    """
    result: list[int] = []
    entry_list: list[int] = list(map(int, entry))
    length = len(entry_list)
    start = 0
    # log(f"Calculating max_joltage_combination({entry}({length}), {count})")
    for _ in range(count):
        max_digit = -1
        max_index = -1
        end = length - (count - len(result)) + 1  # ensure enough digits left

        for i in range(start, end):
            if entry_list[i] > max_digit:
                max_digit = entry_list[i]
                max_index = i
        # log(f"From range {start} to {end}, ({entry_list[start:end]}) max digit is {max_digit} at index {max_index}")
        result.append(max_digit)
        start = max_index + 1
    # log(f"max_joltage_combination({entry}, {count}) = {result}")
    return int("".join(str(d) for d in result))


def _part2(data: str) -> int:
    """Solve part 2."""
    result = 0
    for entry in _split_data(data):
        result += max_joltage_combination(entry, 12)
    return result


def solve(test: bool = False) -> None:
    """Solve day 3."""
    try:
        data = load_input(3, test=test)
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
