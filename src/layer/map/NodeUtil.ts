export function removeNodesByLabel(nodes: any[], labels: string[]): any[] {
  return nodes.filter((node: any) => {
    if (labels.includes(node.label)) {
      return false;
    }
    if (node.children) {
      node.children = removeNodesByLabel(node.children, labels);
    }
    return true;
  });
}
export function findNodeByLabel(nodes: any[], targetLabel: string) {
  for (const node of nodes) {
    if (node.label === targetLabel) {
      return node; // 找到匹配的节点，返回它
    }

    if (node.children && node.children.length > 0) {
      const result: any = findNodeByLabel(node.children, targetLabel); // 递归搜索子节点
      if (result) {
        return result; // 找到匹配的节点，返回它
      }
    }
  }

  return null; // 没有找到匹配的节点
}
export function findNodeById(nodes: any[], id: string) {
  for (const node of nodes) {
    if (node.id === id) {
      return node; // 找到匹配的节点，返回它
    }

    if (node.children && node.children.length > 0) {
      const result: any = findNodeById(node.children, id); // 递归搜索子节点
      if (result) {
        return result; // 找到匹配的节点，返回它
      }
    }
  }

  return null; // 没有找到匹配的节点
}
export function disableNodesWithInvalidGeoType(data: any[], invalidGeoType: string) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];

    if (node.geo_type && node.geo_type.toLowerCase() !== invalidGeoType.toLowerCase()) {
      node.disabled = true;
    }

    if (node.children && node.children.length > 0) {
      disableNodesWithInvalidGeoType(node.children, invalidGeoType);
    }
  }
}
