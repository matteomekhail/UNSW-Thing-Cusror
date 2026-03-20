# Study note: Graph traversal — BFS vs DFS

## One-line summary

**Breadth-first search (BFS)** explores layer by layer from a start node; **depth-first search (DFS)** goes as deep as possible before backtracking.

## When to use which

| Situation | Prefer |
|-----------|--------|
| Shortest path in an **unweighted** graph | BFS |
| Detecting cycles (directed/undirected, with care) | DFS (often with colours: white/grey/black) |
| Topological sort | DFS (postorder on a DAG) |
| “Is there a path?” (any path) | Either; DFS often simpler to code recursively |
| Memory is tight, graph is deep | BFS queue can grow wide; DFS stack depth can grow tall — depends on shape |

## BFS — sketch

1. Enqueue start; mark visited.
2. While queue not empty: dequeue `u`; for each neighbour `v` not visited, mark, enqueue, record parent/dist if needed.

**Properties:** visits nodes in increasing distance (in unweighted graphs) from the start. Time **O(V + E)** with adjacency lists.

## DFS — sketch

1. Mark current node visited.
2. Recurse (or explicit stack) on unvisited neighbours.

**Variants:** preorder / postorder / “finish times” matter for SCCs and topo sort on DAGs.

## Pitfall

For **weighted** shortest paths, use Dijkstra (non-negative) or Bellman–Ford (general); plain BFS is only for unweighted edges (or weight 1).

## Quick self-check

1. On a tree rooted at `r`, does BFS from `r` always visit nodes in non-decreasing depth? (Yes.)
2. Can DFS find the shortest path in an unweighted graph? (Not guaranteed — it might take a long detour first.)

---

*Generated as a random study note — edit or replace topics as you like.*
