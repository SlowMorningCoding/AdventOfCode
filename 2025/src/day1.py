"""
https://adventofcode.com/2025/day/1

--- Day 1: Secret Entrance ---

The Elves have good news and bad news.

The good news is that they've discovered project management! This has given
them the tools they need to prevent their usual Christmas emergency. For
example, they now know that the North Pole decorations need to be finished
soon so that other critical tasks can start on time.

The bad news is that they've realized they have a different emergency:
according to their resource planning, none of them have any time left to
decorate the North Pole!

To save Christmas, the Elves need you to finish decorating the North Pole
by December 12th.

Collect stars by solving puzzles. Two puzzles will be made available on
each day; the second puzzle is unlocked when you complete the first. Each
puzzle grants one star. Good luck!

You arrive at the secret entrance to the North Pole base ready to start
decorating. Unfortunately, the password seems to have been changed, so you
can't get in. A document taped to the wall helpfully explains:

"Due to new security protocols, the password is locked in the safe below.
Please see the attached document for the new combination."

The safe has a dial with only an arrow on it; around the dial are the
numbers 0 through 99 in order. As you turn the dial, it makes a small click
noise as it reaches each number.

The attached document (your puzzle input) contains a sequence of rotations,
one per line, which tell you how to open the safe. A rotation starts with
an L or R which indicates whether the rotation should be to the left
(toward lower numbers) or to the right (toward higher numbers). Then, the
rotation has a distance value which indicates how many clicks the dial
should be rotated in that direction.

So, if the dial were pointing at 11, a rotation of R8 would cause the dial
to point at 19. After that, a rotation of L19 would cause it to point at 0.

Because the dial is a circle, turning the dial left from 0 one click makes
it point at 99. Similarly, turning the dial right from 99 one click makes
it point at 0.

So, if the dial were pointing at 5, a rotation of L10 would cause it to
point at 95. After that, a rotation of R5 could cause it to point at 0.

The dial starts by pointing at 50.

You could follow the instructions, but your recent required official North
Pole secret entrance security training seminar taught you that the safe is
actually a decoy. The actual password is the number of times the dial is
left pointing at 0 after any rotation in the sequence.

For example, suppose the attached document contained the following
rotations:

L68
L30
R48
L5
R60
L55
L1
L99
R14
L82

Following these rotations would cause the dial to move as follows:

The dial starts by pointing at 50.
The dial is rotated L68 to point at 82.
The dial is rotated L30 to point at 52.
The dial is rotated R48 to point at 0.
The dial is rotated L5 to point at 95.
The dial is rotated R60 to point at 55.
The dial is rotated L55 to point at 0.
The dial is rotated L1 to point at 99.
The dial is rotated L99 to point at 0.
The dial is rotated R14 to point at 14.
The dial is rotated L82 to point at 32.

Because the dial points at 0 a total of three times during this process,
the password in this example is 3.

Analyze the rotations in your attached document. What's the actual password
to open the door?

--- Solution ---
Your puzzle answer was 1182.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---
You're sure that's the right password, but the door won't open. You knock,
but nobody answers. You build a snowman while you think.

As you're rolling the snowballs for your snowman, you find another security
document that must have fallen into the snow:

"Due to newer security protocols, please use password method 0x434C49434B
until further notice."

You remember from the training seminar that "method 0x434C49434B" means
you're actually supposed to count the number of times any click causes the
dial to point at 0, regardless of whether it happens during a rotation or
at the end of one.

Following the same rotations as in the above example, the dial points at
zero a few extra times during its rotations:

The dial starts by pointing at 50.
The dial is rotated L68 to point at 82; during this rotation, it points at 0 once.
The dial is rotated L30 to point at 52.
The dial is rotated R48 to point at 0.
The dial is rotated L5 to point at 95.
The dial is rotated R60 to point at 55; during this rotation, it points at 0 once.
The dial is rotated L55 to point at 0.
The dial is rotated L1 to point at 99.
The dial is rotated L99 to point at 0.
The dial is rotated R14 to point at 14.
The dial is rotated L82 to point at 32; during this rotation, it points at 0 once.

In this example, the dial points at 0 three times at the end of a rotation,
plus three more times during a rotation. So, in this example, the new
password would be 6.

Be careful: if the dial were pointing at 50, a single rotation like R1000
would cause the dial to point at 0 ten times before returning back to 50!

Using password method 0x434C49434B, what is the password to open the door?

--- Solution ---
Your puzzle answer was 6907.

That's the right answer! You are one gold star closer to decorating the North Pole.

You have completed Day 1!
"""

from .utils import load_input


class Dial:
    """Class representing the dial of the safe for part 1."""

    def __init__(self) -> None:
        """Initialize the dial."""
        self.position = 50
        self.zero_stops = 0
        self.zero_overs = 0

    def rotate(self, direction: str, distance: int) -> None:
        """Rotate the dial.

        Args:
            direction (str): 'L' for left, 'R' for right
            distance (int): number of clicks to rotate
        """
        # Calculate full rotations and remaining distance
        full_rotations = distance // 100
        self.zero_overs += full_rotations
        remaining_distance = distance % 100
        if direction == "L":
            new_position = (self.position - remaining_distance) % 100
            # Check if we crossed zero during the rotation
            if self.position < new_position and self.position != 0:
                self.zero_overs += 1
            self.position = new_position
        elif direction == "R":
            new_position = (self.position + remaining_distance) % 100
            # Check if we crossed zero during the rotation
            if self.position > new_position and new_position != 0:
                self.zero_overs += 1
            self.position = new_position
        else:
            raise ValueError("Direction must be 'L' or 'R'.")
        # Check if we ended up at zero
        if self.position == 0:
            self.zero_overs += 1
            self.zero_stops += 1


def log(str_msg: str) -> None:
    """Log a message to the console (for debugging)."""
    print(str_msg)


def _split_data(data: str) -> list[tuple[str, int]]:
    """Split input data into list of (direction, distance) tuples."""
    entrys: list[tuple[str, int]] = []
    for line in data.splitlines():
        line = line.strip()
        if not line:
            continue
        direction = line[0]
        try:
            distance = int(line[1:])
        except ValueError:
            raise ValueError(f"Invalid rotation line: {line!r}") from None
        entrys.append((direction, distance))
    return entrys


def _part1(data: str) -> int:
    """Solve part 1."""
    dial = Dial()
    for rotation in _split_data(data):
        direction, distance = rotation
        dial.rotate(direction, distance)
        log(
            f"After {direction}{distance}: position={dial.position}, \
            zero_overs={dial.zero_overs}, zero_stops={dial.zero_stops}"
        )
    return dial.zero_stops


def _part2(data: str) -> int:
    """Solve part 2."""
    dial = Dial()
    for rotation in _split_data(data):
        direction, distance = rotation
        dial.rotate(direction, distance)
        log(
            f"After {direction}{distance}: position={dial.position}, \
            zero_overs={dial.zero_overs}, zero_stops={dial.zero_stops}"
        )
    return dial.zero_overs


def solve(test: bool = False) -> None:
    """Solve day 1."""
    # Use the shared input loader from `src.utils` which raises on missing
    # files; catch the error to preserve user-friendly message.
    try:
        data = load_input(1, test=test)
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
