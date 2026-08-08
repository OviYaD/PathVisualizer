import { getNeighbors } from "../grid";

// Breadth-first search: explores in concentric rings, ignores weights,
// guarantees the shortest path by number of steps (not by cost).
export function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const visited = new Set();
  const queue = [startNode];
  visited.add(`${startNode.row}-${startNode.col}`);
  startNode.distance = 0;

  while (queue.length) {
    const current = queue.shift();
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.previousNode = current;
        neighbor.distance = current.distance + 1;
        queue.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
