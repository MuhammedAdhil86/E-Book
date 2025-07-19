import { useState, useLayoutEffect } from "react";

export function useIsOverflow(ref) {
  const [isOverflow, setIsOverflow] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      setIsOverflow(el.scrollHeight > el.clientHeight);
    }
  }, [ref]);
  return isOverflow;
}
