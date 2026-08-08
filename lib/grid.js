// Core grid data structure shared by every algorithm.
// A "node" is a plain object so it stays trivially serializable and cheap to clone.

export function createNode(row, col, startPos, endPos) {
  return {
    row,
    col,
    isStart: row === startPos.row && col === startPos.col,
    isEnd: row === endPos.row && col === endPos.col,
    isWall: false,
    isWeight: false,
    weight: 1,
    distance: Infinity,
    heuristic: 0,
    fScore: Infinity,
    isVisited: false,
    previousNode: null,
  };
}

export function createGrid(rows, cols, startPos, endPos) {
  const grid = [];
  for (let row = 0; row < rows; row += 1) {
    const currentRow = [];
    for (let col = 0; col < cols; col += 1) {
      currentRow.push(createNode(row, col, startPos, endPos));
    }
    grid.push(currentRow);
  }
  return grid;
}

// Returns a fresh grid with the same walls/weights/start/end but every
// algorithm-run field reset. Used before each visualization run.
export function resetAlgorithmState(grid) {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      distance: Infinity,
      heuristic: 0,
      fScore: Infinity,
      isVisited: false,
      previousNode: null,
    }))
  );
}

// Clears walls/weights too, keeping only the grid shape and start/end position.
export function clearGrid(grid, startPos, endPos) {
  return createGrid(grid.length, grid[0].length, startPos, endPos);
}

export function toggleWall(grid, row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return grid;
  const newGrid = grid.slice();
  const newRow = newGrid[row].slice();
  newRow[col] = { ...node, isWall: !node.isWall, isWeight: false, weight: 1 };
  newGrid[row] = newRow;
  return newGrid;
}

export function toggleWeight(grid, row, col, weightValue = 5) {
  const node = grid[row][col];
  if (node.isStart || node.isEnd || node.isWall) return grid;
  const newGrid = grid.slice();
  const newRow = newGrid[row].slice();
  const nowWeighted = !node.isWeight;
  newRow[col] = {
    ...node,
    isWeight: nowWeighted,
    weight: nowWeighted ? weightValue : 1,
  };
  newGrid[row] = newRow;
  return newGrid;
}

export function moveEndpoint(grid, fromRow, fromCol, toRow, toCol, endpointKey) {
  const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
  newGrid[fromRow][fromCol][endpointKey] = false;
  const target = newGrid[toRow][toCol];
  target[endpointKey] = true;
  target.isWall = false;
  target.isWeight = false;
  target.weight = 1;
  return newGrid;
}

export function getNeighbors(grid, node) {
  const { row, col } = node;
  const neighbors = [];
  const rows = grid.length;
  const cols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((n) => !n.isWall);
}

export function getNodesInShortestPathOrder(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}

export function findStartAndEnd(grid) {
  let start = null;
  let end = null;
  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) start = node;
      if (node.isEnd) end = node;
    }
  }
  return { start, end };
}
