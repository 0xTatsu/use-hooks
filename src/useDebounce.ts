import { useRef, useEffect, useCallback } from 'react';

export default function useDebounce<T>(
  callback: (args: T) => void,
  delay: number,
) {
  const isMounted: { current: boolean } = useRef(true);
  const timerId: { current: number | undefined } = useRef(undefined);

  useEffect(() => () => { isMounted.current = false }, [] ); // prettier-ignore

  const cancel = useCallback(() => {
    clearTimeout(timerId.current);
  }, []);

  const debouncedCallback = useCallback(
    (args: T) => {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        if (isMounted.current) {
          callback(args);
        }
      }, delay);
    },
    [callback, delay],
  );
  return [debouncedCallback, cancel];
}
