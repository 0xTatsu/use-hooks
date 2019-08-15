import { useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

export default function useWhyUpdate(name: string, props: Record<string, any>) {
  const latestProps = useRef(props);

  useEffect(() => {
    if (!latestProps) return;

    const allKeys = Object.keys({ ...latestProps.current, ...props });

    const changesObj: Record<string, { from: any; to: any; isDeepEqual: boolean }> = {}; // prettier-ignore
    allKeys.forEach(key => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: latestProps.current[key],
          to: props[key],
          isDeepEqual: isEqual(latestProps.current[key], props[key]),
        };
      }
    });

    if (Object.keys(changesObj).length) {
      console.warn(`[why-Update-${name}]`, changesObj);
    }

    latestProps.current = props;
  }, [name, props]);
}
