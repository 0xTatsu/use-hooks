import { useRef, useEffect, EventHandler, SyntheticEvent } from 'react';

export type EventListenerProps = (
  eventName: string, // https://developer.mozilla.org/en-US/docs/Web/Events
  handler: EventHandler<SyntheticEvent<any>>,
  target?: HTMLElement,
) => void;
const useEventListener: EventListenerProps = (
  eventName,
  handler,
  target = global as any,
) => {
  const savedHandler: { current: EventHandler<any> | undefined } = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!target || !target.addEventListener) return;
    const eventListener = (even: Event) => {
      savedHandler.current && savedHandler.current(even);
    };
    target.addEventListener(eventName, eventListener);
    return () => {
      target.removeEventListener(eventName, eventListener);
    };
  }, [eventName, target]);
};

export default useEventListener;
