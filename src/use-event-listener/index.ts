import { useRef, useEffect, EventHandler, SyntheticEvent } from 'react';

export type EventListenerProps = (
  eventName: string, // https://developer.mozilla.org/en-US/docs/Web/Events
  handler: EventHandler<SyntheticEvent<any>>,
  target?: HTMLElement | Window,
) => void;
const useEventListener: EventListenerProps = (
  eventName,
  handler,
  target, // = window,
) => {
  const savedHandler: { current: EventHandler<any> | undefined } = useRef();
  // always get latest handler ...
  // ... without passing it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!target || !target.addEventListener) return;
    const eventListener = (event: Event) => {
      savedHandler.current && savedHandler.current(event);
    };
    target.addEventListener(eventName, eventListener);
    return () => {
      target.removeEventListener(eventName, eventListener);
    };
  }, [eventName, target]);
};

export default useEventListener;

/*
USAGE
function App(){
  // State for storing mouse coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handler = useCallback(
    ({ clientX, clientY }) => {
      // Update coordinates
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords]
  );
  
  // Add event listener using our hook
  useEventListener('mousemove', handler);
  
  return (
    <h1>
      The mouse position is ({coords.x}, {coords.y})
    </h1>
  );
}


*/
