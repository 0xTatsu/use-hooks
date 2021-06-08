import { useEffect, useRef } from "react";

/**
 * Use setInterval with Hooks in a declarative way.
 *
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export default function useInterval(callback, delay) {
  const intervalRef = useRef<number | null>(null);
  const savedCallback = useRef(null);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset.

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (typeof delay !== "number") return;

    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(intervalRef.current);
  }, [delay]); // We only wanted to avoid resetting it when the callback changes. But when the delay changes, we want to restart the timer!

  // Returns a ref to the interval ID in case you want to clear it manually:
  return intervalRef.current;
}
