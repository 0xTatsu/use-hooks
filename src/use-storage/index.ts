import React from 'react';
import useEventListener from 'hooks/use-event-listener';

export const createStorage = (provider: any) => ({
  get(key: string, defaultValue: any) {
    const value = provider.getItem(key);
    return value === null
      ? typeof defaultValue === 'function'
        ? defaultValue()
        : defaultValue
      : JSON.parse(value);
  },
  set(key: string, value: any) {
    provider.setItem(key, JSON.stringify(value));
  },
});

export const createPersistedState = (
  key: string,
  provider = window.localStorage,
) => {
  if (provider) {
    const storage = createStorage(provider);
    return (initialState: any) => usePersistedState(initialState, key, storage);
  }
  return React.useState;
};

const globalState: FieldValue = {};
export const createGlobalState = (
  key: string,
  thisCallback: any,
  initialValue: any,
) => {
  if (!globalState[key]) {
    globalState[key] = { callbacks: [], value: initialValue };
  }
  globalState[key].callbacks.push(thisCallback);
  return {
    deregister() {
      const arr = globalState[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value: any) {
      if (globalState[key].value !== value) {
        globalState[key].value = value;
        globalState[key].callbacks.forEach((callback: any) => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    },
  };
};

const usePersistedState = (
  initialState: any,
  key: string,
  { get, set }: any,
) => {
  const globalState = React.useRef<any>(undefined);
  const [state, setState] = React.useState(() => get(key, initialState));

  useEventListener('storage', ({ key: k, newValue }: any) => {
    const newState = JSON.parse(newValue);
    if (k === key && state !== newState) {
      setState(newState);
    }
  });

  React.useEffect(() => {
    // register a listener that calls `setState` when another instance emits
    globalState.current = createGlobalState(key, setState, initialState);

    return () => {
      globalState.current.deregister();
    };
  }, [initialState, key]);

  // Only persist to storage if state changes.
  React.useEffect(() => {
    set(key, state);

    // inform all of the other instances in this tab
    globalState.current.emit(state);
  }, [key, set, state]);

  return [state, setState];
};
