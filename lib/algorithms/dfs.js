import { getNeighbors } from "../grid";

// Depth-first search: dives down one branch as far as it can before
// backtracking. Finds *a* path, not necessarily the shortest one.
export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const visited = new Set();

  function walk(node) {
    const key = `${node.row}-${node.col}`;
    if (visited.has(key)) return false;
    visited.add(key);
    node.isVisited = true;
    visitedNodesInOrder.push(node);

    if (node === endNode) return true;

    const neighbors = getNeighbors(grid, node);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(neighborKey)) {
        neighbor.previousNode = node;
        if (walk(neighbor)) return true;
      }
    }
    return false;
  }

  walk(startNode);
  return visitedNodesInOrder;
}
