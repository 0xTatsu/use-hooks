import { useRef, useEffect, EventHandler } from 'react';

export type EventListenerProps = (
  eventName: string,
  handler: EventHandler<any>,
  target?: HTMLElement | Window,
) => void;
const useEventListener: EventListenerProps = (
  eventName,
  handler,
  target = window,
) => {
  const savedHandler: { current: EventHandler<any> | undefined } = useRef();
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
