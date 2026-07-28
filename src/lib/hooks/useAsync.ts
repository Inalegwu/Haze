import React, { useEffect } from 'react';

/**
 *
 * Custom hook for accessing async values in React without writing
 * the same useEffect pattern everywhere
 *
 * @param promise () => Promise<T>
 *
 * @returns T
 */
export default function useAsync<T>(promise: () => Promise<T>) {
  const [data, setData] = React.useState<T>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await promise();

      setData(result);
      setIsLoading(false);
    })();
    setIsLoading(false);
  }, [promise]);

  return { data, isLoading };
}
