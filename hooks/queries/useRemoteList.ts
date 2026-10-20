'use client';

import { useEffect, useRef } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

// One shared empty array: a fresh `[]` per render would break memoised dependants and cause render loops.
const EMPTY: never[] = [];

export interface RemoteList<T> {
  data: T[];
  /** Optimistically replace the cached list (e.g. after toggling or deleting one row). */
  setData: (updater: (previous: T[]) => T[]) => void;
  /** True during every fetch, including manual refreshes (drives spinners). */
  loading: boolean;
  refetch: () => Promise<unknown>;
  isError: boolean;
  error: Error | null;
}

/**
 * Admin list backed by TanStack Query instead of fetch-in-useEffect + useState.
 * `staleTime: 0` keeps the admin behaviour of reloading on every visit (edits made on other pages must show up),
 * while cached rows still render instantly during the refetch. Keys are hashed structurally, so inline arrays are fine.
 */
export function useRemoteList<T>(
  key: readonly (string | number)[],
  fetcher: () => Promise<T[]>,
  onError?: (error: Error) => void,
  options: { keepPrevious?: boolean } = {}
): RemoteList<T> {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: key,
    queryFn: fetcher,
    staleTime: 0,
    // Opt-in: for filters/search, keep showing the last result while the new one loads instead of flashing empty.
    placeholderData: options.keepPrevious ? keepPreviousData : undefined,
  });

  // Report a failed load once per distinct error; the callback is read through a ref so inline closures are fine.
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  });
  useEffect(() => {
    if (query.error) onErrorRef.current?.(query.error);
  }, [query.error]);

  return {
    data: query.data ?? EMPTY,
    setData: (updater) => {
      queryClient.setQueryData<T[]>(key, (previous) => updater(previous ?? []));
    },
    loading: query.isFetching,
    // Wrapped so click handlers can pass `refetch` directly without the event becoming query options.
    refetch: () => query.refetch(),
    isError: query.isError,
    error: query.error,
  };
}
