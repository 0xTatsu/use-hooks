import { renderHook } from '@testing-library/react-hooks';
import useEventListener from './index';

const mouseMoveEvent = { clientX: 100, clientY: 200 };
let hackHandler: any;

const mockTarget = {
  addEventListener: (eventName: any, handler: any) => {
    hackHandler = handler;
  },
  removeEventListener: () => {
    hackHandler = undefined;
  },
  dispatchEvent: (event: any) => {
    hackHandler(event);
  },
};

describe('useEventListener', () => {
  test('you pass an `eventName`, `handler`, and an `element`', () => {
    const handler = jest.fn();
    const spy = jest.spyOn(mockTarget, 'addEventListener');

    renderHook(() => useEventListener('foo', handler, mockTarget as any));

    expect(spy).toBeCalled();

    mockTarget.dispatchEvent(mouseMoveEvent);
    expect(handler).toBeCalledWith(mouseMoveEvent);

    spy.mockRestore();
  });

  // test.only('`element` is optional (defaults to `window`/`global`)', () => {
  //   const handler = jest.fn();
  //   const spy = jest.spyOn(globalAny, 'addEventListener');

  //   renderHook(() => useEventListener('foo', handler));
  //   expect(spy).toBeCalled();

  //   spy.mockRestore();
  // });

  test('do not call EvenListener (i.e. no window)', () => {
    const handler = jest.fn();
    const spy = jest.spyOn(mockTarget, 'addEventListener' as any);

    renderHook(() => useEventListener('foo', handler, {} as any));
    expect(spy).not.toBeCalled();

    spy.mockRestore();
  });
});
