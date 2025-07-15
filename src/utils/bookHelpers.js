export async function fetchBookData(bookId) {
  const [bookRes, contentRes] = await Promise.all([
    api.get(`/ebook/cover/${bookId}`),
    api.get(`/ebook-content/${bookId}`)
  ]);
  return { bookRes: bookRes.data, contentRes: contentRes.data };
}

export function generateNumberedTree(nodes, prefix = []) {
  return nodes.map((node, idx) => {
    const numbering = [...prefix, idx + 1].join(".");
    const numberedNode = { ...node, numbering };
    if (node.children) {
      numberedNode.children = generateNumberedTree(node.children, [...prefix, idx + 1]);
    }
    return numberedNode;
  });
}

export const flattenTopics = (nodes = []) =>
  nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);

export function cleanHTML(rawHTML) {
  // Same cleanHTML implementation...
}

export function parseDraftContent(html, cleanHTMLFn, setPopupData) {
  // Slight adaptation using cleanHTMLFn and setPopupData
}
