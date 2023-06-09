function findCycleNodes(data) {
  const adjacencyList = {}; // 邻接列表

  // 创建邻接列表
  for (const edge of data) {
    const { source, target } = edge;
    if (!adjacencyList[source]) {
      adjacencyList[source] = [];
    }
    adjacencyList[source].push(target);
  }

  // 深度优先搜索
  function dfs(node, visited, stack, cycleNodes) {
    visited.add(node);
    stack.push(node);

    if (adjacencyList[node]) {
      for (const neighbor of adjacencyList[node]) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, visited, stack, cycleNodes);
        } else if (stack.includes(neighbor)) {
          // 找到一个形成环的节点
          const cycleStartIndex = stack.indexOf(neighbor);
          const cycle = stack.slice(cycleStartIndex);
          cycleNodes.push(...cycle);
        }
      }
    }

    stack.pop();
  }

  const visitedNodes = new Set(); // 已访问的节点

  const res = [];
  // 遍历每个节点进行深度优先搜索
  for (const node in adjacencyList) {
    if (!visitedNodes.has(node)) {
      const cycleNodes = []; // 存储形成环的节点

      dfs(node, visitedNodes, [], cycleNodes);
      res.push(cycleNodes);
    }
  }
  return res;
}

const data = [
  {
    source: 'node2',
    target: 'node1',
  },
  {
    source: 'node3',
    target: 'node4',
  },
  {
    source: 'node1',
    target: 'node3',
  },

  {
    source: 'node4',
    target: 'node2',
  },
  {
    source: 'node2',
    target: 'node9',
  },

  {
    source: 'A',
    target: 'B',
  },

  {
    source: 'B',
    target: 'C',
  },
  {
    source: 'D',
    target: 'E',
  },
  {
    source: 'C',
    target: 'D',
  },
  {
    source: 'E',
    target: 'A',
  },
];

console.log(findCycleNodes(data));
