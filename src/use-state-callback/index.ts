import { useState, useEffect, useLayoutEffect } from 'react';

const useStateCallback = (initialState, callback) => {
  const [state, setState] = useState(initialState);

  useEffect(() => callback(state), [state, callback]);

  return [state, setState];
};

const useStateLayoutCallback = (initialState, callback) => {
  const [state, setState] = useState(initialState);

  useLayoutEffect(() => callback(state), [state, callback]);

  return [state, setState];
};

export { useStateLayoutCallback };

export default useStateCallback;
