import { useEffect, useState } from 'react';
import api from '../api/Instance';
import { useBookStore } from '../store/useBookStore';

const generateNumberedTree = (nodes, prefix = []) =>
  nodes.map((n, i) => ({
    ...n,
    numbering: [...prefix, i + 1].join('.'),
    children: n.children ? generateNumberedTree(n.children, [...prefix, i + 1]) : [],
  }));

export function useFetchBook(bookId) {
  const [loading, setLoading] = useState(true);
  const { setBookInfo, setChapters } = useBookStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [b, c] = await Promise.all([
          api.get(`/ebook/cover/${bookId}`),
          api.get(`/ebook-content/${bookId}`),
        ]);
        setBookInfo(b.data);
        setChapters(generateNumberedTree(c.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookId, setBookInfo, setChapters]);

  return loading;
}
