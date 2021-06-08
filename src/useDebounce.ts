import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      // it doesn't matter whether we should clear first
      // ...because when value changes, this one will be triggered
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

/*
// JS Implementation
function debounce (fn, delay) {
  let id;
  return function (args) { // arrow function will use global scope
    clearTimeout(id) // need to clear first

    id = setTimeout(() => {
        fn.call(this, args) // when its a method of an object
    }, delay)
  }
}
 */
