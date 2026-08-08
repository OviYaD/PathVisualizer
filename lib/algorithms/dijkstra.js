import { getNeighbors } from "../grid";

// Dijkstra's algorithm: always settles the closest unvisited node next,
// so it accounts for weighted terrain and guarantees the lowest-cost path.
export function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  const unvisited = [];
  for (const row of grid) {
    for (const node of row) {
      unvisited.push(node);
    }
  }

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift();

    if (closest.distance === Infinity) break; // remaining nodes unreachable
    if (closest.isWall) continue;

    closest.isVisited = true;
    visitedNodesInOrder.push(closest);

    if (closest === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(grid, closest);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited) continue;
      const tentativeDistance = closest.distance + (neighbor.weight || 1);
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = closest;
      }
    }
  }

  return visitedNodesInOrder;
}
