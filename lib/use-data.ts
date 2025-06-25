import { useCallback, useEffect, useState } from "react";

export const useData = <T>({
  fetch,
}: {
  fetch?: () => Promise<{ data: T | null; error: Error | null }>;
}): { data?: T; error?: string; loading: boolean; refetch: () => void } => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<T>();

  const fetchData = useCallback(async () => {
    if (!fetch) return;

    setLoading(true);

    const { data, error } = await fetch();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setData(data ?? undefined);
    setError(undefined);
    setLoading(false);
  }, [fetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
};
