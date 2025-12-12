"""
https://adventofcode.com/2025/day/4

--- Day 4: Printing Department ---
You ride the escalator down to the printing department. They're clearly
getting ready for Christmas; they have lots of large rolls of paper
everywhere, and there's even a massive printer in the corner (to handle the
really big print jobs).

Decorating here will be easy: they can make their own decorations. What you
really need is a way to get further into the North Pole base while the
elevators are offline.

"Actually, maybe we can help with that," one of the Elves replies when you
ask for help. "We're pretty sure there's a cafeteria on the other side of
the back wall. If we could break through the wall, you'd be able to keep
moving. It's too bad all of our forklifts are so busy moving those big
rolls of paper around."

If you can optimize the work the forklifts are doing, maybe they would have
time to spare to break through the wall.

The rolls of paper (@) are arranged on a large grid; the Elves even have a
helpful diagram (your puzzle input) indicating where everything is located.

For example:

..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

The forklifts can only access a roll of paper if there are fewer than four
rolls of paper in the eight adjacent positions. If you can figure out which
rolls of paper the forklifts can access, they'll spend less time looking
and more time breaking down the wall to the cafeteria.

In this example, there are 13 rolls of paper that can be accessed by a
forklift (marked with x):

..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Consider your complete diagram of the paper roll locations. How many rolls
of paper can be accessed by a forklift?

--- Solution ---
Your puzzle answer was 1351.

--- Part Two ---
Now, the Elves just need help accessing as much of the paper as they can.

Once a roll of paper can be accessed by a forklift, it can be removed. Once
a roll of paper is removed, the forklifts might be able to access more
rolls of paper, which they might also be able to remove. How many total
rolls of paper could the Elves remove if they keep repeating this process?

Starting with the same example as above, here is one way you could remove
as many rolls of paper as possible, using x to indicate that a roll
of paper was just removed:

Initial state:
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

Remove 13 rolls of paper:
..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Remove 12 rolls of paper:
.......x..
.@@.x.x.@x
x@@@@...@@
x.@@@@..x.
.@.@@@@.x.
.x@@@@@@.x
.x.@.@.@@@
..@@@.@@@@
.x@@@@@@@.
....@@@...

Remove 7 rolls of paper:
..........
.x@.....x.
.@@@@...xx
..@@@@....
.x.@@@@...
..@@@@@@..
...@.@.@@x
..@@@.@@@@
..x@@@@@@.
....@@@...

Remove 5 rolls of paper:
..........
..x.......
.x@@@.....
..@@@@....
...@@@@...
..x@@@@@..
...@.@.@@.
..x@@.@@@x
...@@@@@@.
....@@@...

Remove 2 rolls of paper:
..........
..........
..x@@.....
..@@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@x.
....@@@...

Remove 1 roll of paper:
..........
..........
...@@.....
..x@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
...x@.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
....x.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
..........
...x@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Stop once no more rolls of paper are accessible by a forklift. In this
example, a total of 43 rolls of paper can be removed.

Start with your original diagram. How many rolls of paper in total can be
removed by the Elves and their forklifts?

--- Solution ---
Your puzzle answer was 8345

"""

from .utils import load_input


class Table2D:
    """Two-dimensional table class"""

    def __init__(self, line: int, columns: int, default_value: str = "") -> None:
        """
        Create a 2D table with given number of rows and columns.

        Args:
            line (int): number of rows
            columns (int): number of columns
            default_value: default value for each cell
        Raises:
            ValueError: if rows or columns are not positive integers
        """
        if line <= 0 or columns <= 0:
            raise ValueError("Rows and columns must be positive integers.")
        self.line = line
        self.columns = columns
        self.default_value = default_value
        self.data: list[list[str]] = [[default_value for _ in range(columns)] for _ in range(line)]

    def _check_coordinates(self, r: int, s: int) -> None:
        """Internal helper function to check if coordinates are within bounds."""
        if not (0 <= r < self.line and 0 <= s < self.columns):
            raise IndexError(f"coordinates out of bounds: r={r}, s={s} for table of size {self.line}x{self.columns}")

    def set(self, r: int, s: int, value: str) -> None:
        """Sets the value at given coordinates (r = row, s = column)."""
        self._check_coordinates(r, s)
        self.data[r][s] = value

    def get(self, r: int, s: int):
        """Gets the value at given coordinates (r = row, s = column)."""
        self._check_coordinates(r, s)
        return self.data[r][s]

    def print_table(self):
        """Print the table to the console."""
        print("Table:")
        for row in self.data:
            print("".join(row))

    def load_data(self, data: str) -> None:
        """Load data into the table from a string and change table size accordingly."""
        lines = data.splitlines()
        self.line = len(lines)
        self.columns = max(len(line) for line in lines)
        self.data: list[list[str]] = [[self.default_value for _ in range(self.columns)] for _ in range(self.line)]
        for r, line in enumerate(lines):
            line = line.strip()
            for s, char in enumerate(line):
                self.set(r, s, char)

    def get_octets(self, r: int, s: int) -> list[str]:
        """Get the values of the eight adjacent cells around (r, s)."""
        octets: list[str] = []
        for dr in [-1, 0, 1]:
            for ds in [-1, 0, 1]:
                if dr == 0 and ds == 0:
                    continue
                # nr, ns  = r + dr, s + ds
                nr: int = r + dr
                ns: int = s + ds
                if 0 <= nr < self.line and 0 <= ns < self.columns:
                    octets.append(self.get(nr, ns))
        return octets


def log(str_msg: str) -> None:
    """Log a message to the console (for debugging)."""
    print(str_msg)


def count_char_in_list(char_list: list[str], target_char: str) -> int:
    """Count occurrences of target_char in char_list."""
    count = 0
    for char in char_list:
        if char == target_char:
            count += 1
    return count


def _part1(data: str) -> int:
    """Solve part 1."""
    result = 0
    table = Table2D(10, 10, default_value=".")
    table.load_data(data)
    # Loop through each cell and check accessibility
    for r in range(table.line):
        for s in range(table.columns):
            if table.get(r, s) == "@":
                octets = table.get_octets(r, s)
                accessible_count = count_char_in_list(octets, "@")
                if accessible_count < 4:
                    result += 1
    return result


def _part2(data: str) -> int:
    """Solve part 2."""
    result = 0
    table = Table2D(10, 10, default_value=".")
    table.load_data(data)
    while True:
        to_remove: list[tuple[int, int]] = []
        # Loop through each cell and check accessibility
        for r in range(table.line):
            for s in range(table.columns):
                if table.get(r, s) == "@":
                    octets = table.get_octets(r, s)
                    accessible_count = count_char_in_list(octets, "@")
                    if accessible_count < 4:
                        to_remove.append((r, s))
        if not to_remove:
            break
        for r, s in to_remove:
            table.set(r, s, ":")
        result += len(to_remove)
    table.print_table()
    return result


def solve(test: bool = False) -> None:
    """Solve a day."""
    try:
        data = load_input(4, test=test)
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
