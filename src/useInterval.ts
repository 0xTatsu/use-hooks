import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/*
  A React component may be mounted for a while and go through many different states, but its render result describes all of them at once.
  By contrast, setInterval does not describe a process in time — once you set the interval, you can’t change anything about it except clearing it.
  (setInterval does not “forget”. It will forever reference the old props and state until you replace it — which you can’t do without resetting the time.)
  This hook let us apply the same declarative approach to setInterval
*/
