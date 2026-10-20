'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Everything under (portal) requires an authenticated session. AdminLayout renders children only once the session
// is verified, so page components - and the data they fetch on mount - never run before authentication is ready.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
