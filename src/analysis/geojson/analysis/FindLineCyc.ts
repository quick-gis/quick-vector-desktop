/**
 * [
 *   { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
 *   { start: { x: 1, y: 2 }, end: { x: 1, y: 3 } },
 * ];
 * = >
 * [
 *   { source: 'node1', target: 'node1' },
 *   { source: 'node3', target: 'node2' }
 * ]
 * @param d
 */
function startEndToSt(d: any) {
  let nameToXy = new Map();
  let xyToName = new Map();
  let i = 0;
  const namePre = 'node';
  let s = new Set();
  for (let it of d) {
    let end = it.end;
    let start = it.start;
    let endStr = JSON.stringify(end);
    let startStr = JSON.stringify(start);
    if (!s.has(endStr)) {
      i = i + 1;
      s.add(endStr);
      nameToXy.set(namePre + i, endStr);
      xyToName.set(endStr, namePre + i);
    }
    if (!s.has(startStr)) {
      i = i + 1;
      s.add(startStr);
      nameToXy.set(namePre + i, startStr);
      xyToName.set(startStr, namePre + i);
    }
  }

  let data = [];
  for (let it of d) {
    let source = xyToName.get(JSON.stringify(it.start));
    let target = xyToName.get(JSON.stringify(it.end));
    data.push({
      source: source,
      target: target,
    });
  }
  return {
    data: data,
    nameToXy: nameToXy,
    xyToName: xyToName,
  };
}

/**

 * [
 *   { source: 'node1', target: 'node1' },
 *   { source: 'node3', target: 'node2' }
 * ]
 * => [
 *   { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
 *   { start: { x: 1, y: 2 }, end: { x: 1, y: 3 } },
 * ];
 * = >
 * @param d
 */
function sourceTargetToStartEnd(data: any, nameToXy: any) {
  let res = [];
  for (let it of data) {
    let source = it.source;
    let target = it.target;
    let sourceXyS = nameToXy.get(source);
    let targetXyS = nameToXy.get(target);

    let sourceXy = JSON.parse(sourceXyS);
    let targetXy = JSON.parse(targetXyS);
    res.push({ start: { x: sourceXy.x, y: sourceXy.y }, end: { x: targetXy.x, y: targetXy.y } });
  }
  return res;
}

/**
 * 找到形成环的多个组合
 */
function findCycleNodes(data: any) {
  const adjacencyList: any = {}; // 邻接列表

  // 创建邻接列表
  for (const edge of data) {
    const { source, target } = edge;
    if (!adjacencyList[source]) {
      adjacencyList[source] = [];
    }
    adjacencyList[source].push(target);
  }

  // 深度优先搜索
  function dfs(node: any, visited: any, stack: any, cycleNodes: any) {
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
      const cycleNodes: any = []; // 存储形成环的节点

      dfs(node, visitedNodes, [], cycleNodes);
      res.push(cycleNodes);
    }
  }
  return res;
}

function connectPoints(points: any, nameToXy: any): [] {
  const connections: any = [];

  for (let p of points) {
    connections.push(co(p, nameToXy));
  }

  function co(points: any, nameToXy: any): [] {
    const connections: any = [];

    for (let i = 0; i < points.length - 1; i++) {
      const startPoint: any = points[i];
      const endPoint: any = points[i + 1];
      let st = JSON.parse(nameToXy.get(startPoint));
      let et = JSON.parse(nameToXy.get(endPoint));
      const connection: any = {
        start: {
          x: st.x,
          y: st.y,
        },
        end: {
          x: et.x,
          y: et.y,
        },
      };
      connections.push(connection);
    }
    // 由于要组成环需要补上最后一个和第一个点之间的连线
    connections.push({
      start: {
        x: JSON.parse(nameToXy.get(points[points.length - 1])).x,
        y: JSON.parse(nameToXy.get(points[points.length - 1])).y,
      },
      end: {
        x: JSON.parse(nameToXy.get(points[0])).x,
        y: JSON.parse(nameToXy.get(points[0])).y,
      },
    });
    return connections;
  }

  return connections;
}

/**
 * let findCyc = [
 *   { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
 *   { start: { x: 0, y: 1 }, end: { x: 1, y: 1 } },
 *   { start: { x: 1, y: 1 }, end: { x: 1, y: 0 } },
 *   { start: { x: 1, y: 3 }, end: { x: 1, y: 0 } },
 *   { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
 * ];
 * @param findCyc
 */
export function CoreFindCyc(findCyc: any) {
  const { data, nameToXy } = startEndToSt(findCyc);
  let findCycleNodes1 = findCycleNodes(data);
  return connectPoints(findCycleNodes1, nameToXy);
}
