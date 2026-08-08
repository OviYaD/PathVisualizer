// Recursive-division maze: carves walls into an empty grid by repeatedly
// bisecting chambers with a wall that has one gap, producing a solvable maze.
export function recursiveDivisionWalls(rows, cols, startPos, endPos) {
  const walls = new Set();
  const isProtected = (r, c) =>
    (r === startPos.row && c === startPos.col) ||
    (r === endPos.row && c === endPos.col);

  function divide(rowStart, rowEnd, colStart, colEnd, orientationHorizontal) {
    if (rowEnd - rowStart < 2 || colEnd - colStart < 2) return;

    if (orientationHorizontal) {
      const wallRow =
        rowStart + 1 + Math.floor(Math.random() * (rowEnd - rowStart - 1));
      const gapCol =
        colStart + Math.floor(Math.random() * (colEnd - colStart + 1));
      for (let c = colStart; c <= colEnd; c += 1) {
        if (c === gapCol) continue;
        if (!isProtected(wallRow, c)) walls.add(`${wallRow}-${c}`);
      }
      divide(rowStart, wallRow - 1, colStart, colEnd, colEnd - colStart < rowEnd - rowStart - 2);
      divide(wallRow + 1, rowEnd, colStart, colEnd, colEnd - colStart < rowEnd - rowStart - 2);
    } else {
      const wallCol =
        colStart + 1 + Math.floor(Math.random() * (colEnd - colStart - 1));
      const gapRow =
        rowStart + Math.floor(Math.random() * (rowEnd - rowStart + 1));
      for (let r = rowStart; r <= rowEnd; r += 1) {
        if (r === gapRow) continue;
        if (!isProtected(r, wallCol)) walls.add(`${r}-${wallCol}`);
      }
      divide(rowStart, rowEnd, colStart, wallCol - 1, colEnd - colStart - 2 < rowEnd - rowStart);
      divide(rowStart, rowEnd, wallCol + 1, colEnd, colEnd - colStart - 2 < rowEnd - rowStart);
    }
  }

  divide(0, rows - 1, 0, cols - 1, rows > cols);
  return walls;
}
