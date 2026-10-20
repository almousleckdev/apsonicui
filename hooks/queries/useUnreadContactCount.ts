'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAdminContactUnreadCount } from '@/services/contact';

export const UNREAD_CONTACT_KEY = ['admin', 'contact', 'unread'] as const;

/** Unread contact messages, polled every 30s. Shared by the header badge and the notifications page. */
export function useUnreadContactCount() {
  return useQuery({
    queryKey: UNREAD_CONTACT_KEY,
    queryFn: async () => (await fetchAdminContactUnreadCount()).data?.unreadCount ?? 0,
    refetchInterval: 30_000,
    staleTime: 0,
    // A failing badge (server restarting, session ending) must never disturb the page: no retries, no errors shown.
    retry: false,
  });
}
