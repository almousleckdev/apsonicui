import type { AdminKey } from './catalog';

/** A validation problem as a catalog key plus its values, so a form can show it in the admin's display language. */
export interface AdminProblem {
  key: AdminKey;
  values?: Record<string, string | number>;
}
