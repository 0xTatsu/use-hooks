import React, { useEffect, useRef } from "react";

// @see: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component/54292872#54292872
export default function useOuterClick(callback) {
  const callbackRef = useRef();
  const outerRef = useRef(); // returned to client to set ref

  // update callback on each render, so second useEffect has most recent callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function handleClick(e) {
      if (
        outerRef.current &&
        callbackRef.current &&
        !outerRef.current.contains(e.target) // if target of click isn't element
      ) {
        callbackRef.current(e);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []); // no dependencies

  return outerRef; // convenience for client (doesn't need to init ref himself)
}
/*
// Usage
const Client = () => {
  const [counter, setCounter] = useState(0);
  const innerRef = useOuterClick(e => {
    // counter state is up-to-date, when handler is called
    alert(`Clicked outside! Increment counter to ${counter + 1}`);
    setCounter(c => c + 1);
  });
  return (
    <div>
      <p>Click outside!</p>
      <div id="container" ref={innerRef}>
        Inside, counter: {counter}
      </div>
    </div>
  );
};
 */
// const MOUSEDOWN = "mousedown";
// const TOUCHSTART = "touchstart";
//
// const events = [MOUSEDOWN, TOUCHSTART];
//
// export default function useOnClickOutside(ref, handler) {
//   const handlerRef = useRef(ref.current);
//
//   useEffect(() => {
//     if (!handler) {
//       return;
//     }
//
//     const listener = (event) => {
//       if (
//         !ref.current ||
//         !handlerRef.current ||
//         ref.current.contains(event.target)
//       ) {
//         return;
//       }
//
//       handlerRef.current(event);
//     };
//
//     events.forEach((event) => {
//       document.addEventListener(event, listener);
//     });
//
//     return () => {
//       events.forEach((event) => {
//         document.removeEventListener(event, listener);
//       });
//     };
//   }, [handler]);
// }
