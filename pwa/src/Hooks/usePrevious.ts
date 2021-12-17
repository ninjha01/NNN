import { useCallback, useEffect, useRef } from "react";

export const usePrevious = <T>(
  value: T,
  initialValue: T,
  isEqual: (x: T, y: T) => boolean
): T => {
  const ref = useRef<T>(initialValue);
  const shouldUpdate = useCallback(
    (next: T) => !ref.current || !isEqual(next, ref.current),
    [isEqual]
  );
  useEffect(() => {
    if (shouldUpdate(value)) {
      ref.current = value;
    }
  }, [value, shouldUpdate]);
  return ref.current;
};
