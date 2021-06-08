import { useEffect, useState } from "react";

const useFetch = (url, num) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async (retries) => {
      setIsLoading(true);
      try {
        const res = await fetch(url, {});
        if (res.ok) {
          const json = await res.json();
          setResponse(json.data);
          return;
        }
        if (retries > 0) {
          await fetchData(retries - 1);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(num);
  }, []);

  return { response, error, isLoading };
};
