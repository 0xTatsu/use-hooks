import React, { useRef, useState, useEffect } from "react";

export default function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/*
// JS Implementation
function throttle(fn, duration) {
	let shouldWait = false;
	return function (...args) {
		if (shouldWait) return;

		fn.apply(this, args);
		shouldWait = true;

		setTimeout(() => {
				shouldWait = false;
		}, duration);
	}
}
 */
