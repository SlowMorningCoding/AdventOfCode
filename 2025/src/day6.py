"""
https://adventofcode.com/2025/day/6

--- Day 6: Trash Compactor ---

After helping the Elves in the kitchen, you were taking a break and helping
them re-enact a movie scene when you over-enthusiastically jumped into the
garbage chute!

A brief fall later, you find yourself in a garbage smasher. Unfortunately,
the door's been magnetically sealed.

As you try to find a way out, you are approached by a family of
cephalopods! They're pretty sure they can get the door open, but it will
take some time. While you wait, they're curious if you can help the
youngest cephalopod with her math homework.

Cephalopod math doesn't look that different from normal math. The math
worksheet (your puzzle input) consists of a list of problems; each problem
has a group of numbers that need to be either added (+) or multiplied (*)
together.

However, the problems are arranged a little strangely; they seem to be
presented next to each other in a very long horizontal list. For example:

123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +

Each problem's numbers are arranged vertically; at the bottom of the
problem is the symbol for the operation that needs to be performed.
Problems are separated by a full column of only spaces. The left/right
alignment of numbers within each problem can be ignored.

So, this worksheet contains four problems:

123 * 45 * 6 = 33210
328 + 64 + 98 = 490
51 * 387 * 215 = 4243455
64 + 23 + 314 = 401

To check their work, cephalopod students are given the grand total of
adding together all of the answers to the individual problems. In this
worksheet, the grand total is 33210 + 490 + 4243455 + 401 = 4277556.

Of course, the actual worksheet is much wider. You'll need to make sure to
unroll it completely so that you can read the problems clearly.

Solve the problems on the math worksheet. What is the grand total found by
adding together all of the answers to the individual problems?

--- Solution ---

Your puzzle answer was 4583860641327.

--- Part Two ---

The big cephalopods come back to check on how things are going. When they
see that your grand total doesn't match the one expected by the worksheet,
they realize they forgot to explain how to read cephalopod math.

Cephalopod math is written right-to-left in columns. Each number is given
in its own column, with the most significant digit at the top and the least
significant digit at the bottom. (Problems are still separated with a
column consisting only of spaces, and the symbol at the bottom of the
problem is still the operator to use.)

Here's the example worksheet again:

123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +

Reading the problems right-to-left one column at a time, the problems are
now quite different:

The rightmost problem is 4 + 431 + 623 = 1058
The second problem from the right is 175 * 581 * 32 = 3253600
The third problem from the right is 8 + 248 + 369 = 625
Finally, the leftmost problem is 356 * 24 * 1 = 8544

Now, the grand total is 1058 + 3253600 + 625 + 8544 = 3263827.

Solve the problems on the math worksheet again. What is the grand total
found by adding together all of the answers to the individual problems?

--- Solution ---

Your puzzle answer was 11602774058280
"""

from .utils import load_input


class Table2D:
    """Class for handling two-dimensional arrays (matrices)"""

    def __init__(self):
        self.row = 0
        self.col = 0
        self.data: list[list[str | None]] = []

    def _check_coordinates(self, row: int, col: int) -> None:
        """Internal helper function to check if coordinates are positives and resize table if needed."""
        if not (0 <= row and 0 <= col):
            raise IndexError(f"Coordinates must be non-negative: r={row}, c={col}")
        # Update row and col if needed
        if row > self.row:
            self.row = row
        if col > self.col:
            self.col = col

    def set(self, row: int, col: int, value: str | None) -> None:
        """Set value at given coordinates (r = row, s = column) and resize table if needed."""
        self.data[row][col] = value

    def get(self, row: int, col: int) -> str | None:
        """Get value at given coordinates (r = row, s = column)."""
        return self.data[row][col]

    def transpose(self):
        """Transpose the matrix in place (rows become columns and columns become rows)."""
        if not self.data:
            return
        log(f"Data before transpose: {self.data}")
        transponed_data_tuples = zip(*self.data)
        log(f"Transponed data tuples: {transponed_data_tuples}")
        self.data = [list(row) for row in transponed_data_tuples]
        log(f"Data after transpose: {self.data}")
        self.row, self.col = self.col, self.row


class Calculation:
    """class to take list of numbers and an operator and return the result"""

    def __init__(self) -> None:
        """Initialize calculation class."""
        self.numbers: list[int] = []
        self.operator: str | None = None

    def add_number(self, number: int) -> None:
        self.numbers.append(number)

    def set_operator(self, operator: str) -> None:
        self.operator = operator

    def get_result(self) -> int:
        if self.operator == "+":
            return sum(self.numbers)
        elif self.operator == "*":
            result = 1
            for number in self.numbers:
                result *= number
            return result
        else:
            raise ValueError(f"Unknown operator: {self.operator}")


def log(str_msg: str) -> None:
    """Log a message to the console (for debugging)."""
    print(str_msg)


def _split_data(data: str) -> Table2D:
    """Split input data into Table2D."""
    entrys: Table2D = Table2D()
    for line in data.splitlines():
        line = line.strip()
        if not line:
            continue
        row: list[str | None] = []
        for item in line.split(" "):
            item = item.strip()
            if not item:
                continue
            else:
                row.append(item)
        entrys.data.append(row)
    entrys.row = len(entrys.data)
    entrys.col = max(len(row) for row in entrys.data)
    return entrys


def _part1(data: str) -> int:
    """Solve part 1."""
    result = 0
    entry = _split_data(data)
    entry.transpose()
    for r in range(entry.row):
        calc = Calculation()
        for s in range(entry.col):
            value = entry.get(r, s)
            if value is None:
                continue
            if value in ("+", "*"):
                calc.set_operator(value)
            else:
                try:
                    number = int(value)
                except ValueError:
                    raise ValueError(f"Invalid number: {value!r}") from None
                calc.add_number(number)
        result += calc.get_result()
    return result


class Reader:
    """Class loads data, sets pointter at rightmost column and reads numbers column by column."""

    def __init__(self, data: str):
        """Initialize reader with data."""
        self.data: list[str] = data.splitlines()
        self.rows: int = len(self.data)
        self.cols: int = max(len(line) for line in self.data)
        self.pointer: tuple[int, int] = (0, self.cols)

    def read(self) -> str | None:
        """
        Returns the exact value at the current pointer position.
        moves the pointer down one row or to the top of the previous column if at the bottom.
        after pointer have exceeded the point of bottom of first column, return None.
        """
        r, c = self.pointer
        if c <= 0:
            return None
        if r >= self.rows:
            # Move to top of previous column
            r = 0
            c -= 1
            self.pointer = (r, c)
            if c <= 0:
                return None
        line = self.data[r]
        value = line[c - 1] if c - 1 < len(line) else " "
        self.pointer = (r + 1, c)
        return value


def _part2(data: str) -> int:
    """Solve part 2."""
    result = 0
    reader = Reader(data)
    while True:
        calc = Calculation()
        partial_value: str = ""
        while True:
            value = reader.read()
            if value is None:
                # End of data
                return result
            if value == " ":
                if partial_value:
                    # We have a number to process
                    try:
                        number = int(partial_value)
                    except ValueError:
                        raise ValueError(f"Invalid number: {partial_value!r}") from None
                    calc.add_number(number)
                    partial_value = ""
                continue
            if value in ("+", "*"):
                calc.set_operator(value)
                # We have a number to process
                if partial_value:
                    try:
                        number = int(partial_value)
                    except ValueError:
                        raise ValueError(f"Invalid number: {partial_value!r}") from None
                    calc.add_number(number)
                    partial_value = ""
                break
            else:
                partial_value += value
        log(f"Calculation: numbers={calc.numbers}, operator={calc.operator}, result={calc.get_result()}")
        result += calc.get_result()
    return result


def solve(test: bool = False) -> None:
    """Solve a day."""
    try:
        data = load_input(6, test=test)
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
