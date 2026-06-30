---
title: Mastering Dynamic Programming — A Systematic Grid Approach
date: "2025.10.15"
tags: ["DSA", "Algorithms", "LeetCode"]
---

# Mastering Dynamic Programming

Dynamic programming intimidates most people. After solving 200+ DP problems, I've distilled it into a **4-step framework** that works on 90% of problems.

## The 4-Step Framework

1. **Identify the state** — What information uniquely defines a subproblem?
2. **Define the transition** — How does `dp[i]` depend on smaller subproblems?
3. **Set the base case** — What are the simplest, directly-solvable states?
4. **Determine the traversal order** — Which direction ensures dependencies are resolved first?

---

## Example: 0/1 Knapsack

Classic problem: given items with weights and values, maximize value within capacity `W`.

**State:** `dp[i][w]` = max value using first `i` items with capacity `w`

**Transition:**
```
dp[i][w] = max(
  dp[i-1][w],                          // skip item i
  dp[i-1][w - weight[i]] + value[i]    // take item i (if w >= weight[i])
)
```

**Base case:** `dp[0][w] = 0` for all `w`

```python
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i-1][w]
            if w >= weights[i-1]:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])
    
    return dp[n][W]
```

Time: `O(n·W)` | Space: `O(n·W)` → optimizable to `O(W)` with 1D DP.

---

## The Space Optimization Pattern

Whenever `dp[i]` only depends on `dp[i-1]`, you can collapse to a **1D array** — but traverse in the right direction:

- **0/1 Knapsack** (each item usable once) → traverse `w` **right to left**
- **Unbounded Knapsack** (items reusable) → traverse `w` **left to right**

```python
def knapsack_1d(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        for w in range(W, weights[i] - 1, -1):  # right to left
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]
```

---

## Interval DP

For problems on **substrings or subarrays** (e.g., Burst Balloons, Matrix Chain Multiplication):

- State: `dp[l][r]` — optimal answer for the subproblem on range `[l, r]`
- Iterate by **length** first, then by left endpoint:

```python
for length in range(2, n + 1):
    for l in range(n - length + 1):
        r = l + length - 1
        for k in range(l, r):
            dp[l][r] = max(dp[l][r], dp[l][k] + dp[k+1][r] + cost(l, k, r))
```

---

## Tree DP

Many tree problems involve DP over nodes, where each node's answer depends on its children.

**Example:** Maximum path sum in a binary tree.

```python
def maxPathSum(root):
    res = [float('-inf')]
    
    def dfs(node):
        if not node: return 0
        left  = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        res[0] = max(res[0], left + right + node.val)
        return max(left, right) + node.val
    
    dfs(root)
    return res[0]
```

The key insight: the function **returns** the max gain going *up*, while updating a global best for paths going *through* the node.

---

## Pattern Recognition Cheat Sheet

| Pattern | Signal in problem | Classic examples |
|---|---|---|
| Linear DP | Subsequence, substring, prefix | LCS, LIS, Edit Distance |
| Grid DP | 2D grid, paths | Unique Paths, Minimum Path Sum |
| Interval DP | Merge operations, palindromes | Burst Balloons, Palindrome Partitioning |
| Tree DP | Binary tree, dependency | Max Path Sum, House Robber III |
| Bitmask DP | Small sets (n ≤ 20) | TSP, Hamiltonian Path |
| Digit DP | Count numbers with property | Count digits with constraint |

---

DP mastery comes from pattern recognition, not memorization. Solve 10 problems from each category above and the patterns become instinctive.
