import { getNeighbors } from "../grid";

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// A*: like Dijkstra, but adds a heuristic (Manhattan distance to the goal)
// so it prioritizes nodes that look promising, exploring far less of the
// grid while still guaranteeing the lowest-cost path on an admissible heuristic.
export function astar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristic = manhattan(startNode, endNode);
  startNode.fScore = startNode.heuristic;

  const openSet = [startNode];
  const inOpenSet = new Set([`${startNode.row}-${startNode.col}`]);

  while (openSet.length) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();
    const currentKey = `${current.row}-${current.col}`;
    inOpenSet.delete(currentKey);

    if (current.isWall || current.isVisited) continue;

    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited) continue;
      const tentativeDistance = current.distance + (neighbor.weight || 1);
      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = current;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = manhattan(neighbor, endNode);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;
        const key = `${neighbor.row}-${neighbor.col}`;
        if (!inOpenSet.has(key)) {
          openSet.push(neighbor);
          inOpenSet.add(key);
        }
      }
    }
  }

  return visitedNodesInOrder;
}
