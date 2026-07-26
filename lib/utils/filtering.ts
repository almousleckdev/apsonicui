/**
 * A generic filtering utility to unify filtering logic across the application.
 */

export interface FilterOptions<T> {
  // Exact match filters (e.g., category, status)
  exact?: Partial<Record<keyof T, unknown>>;
  // Partial match filters (e.g., country name, address)
  partial?: Partial<Record<keyof T, string>>;
  // Search filter across multiple fields
  search?: {
    query: string;
    fields: (keyof T)[];
  };
}

export function applyFilters<T>(data: T[], options: FilterOptions<T>): T[] {
  return data.filter((item) => {
    // 1. Exact match check
    if (options.exact) {
      for (const [key, value] of Object.entries(options.exact)) {
        if (
          value !== undefined &&
          value !== "all" &&
          item[key as keyof T] !== value
        ) {
          return false;
        }
      }
    }

    // 2. Partial match check (case-insensitive)
    if (options.partial) {
      for (const [key, value] of Object.entries(options.partial)) {
        if (value) {
          const itemValue = String(item[key as keyof T] || "").toLowerCase();
          const filterValue = String(value).toLowerCase();
          if (!itemValue.includes(filterValue)) {
            return false;
          }
        }
      }
    }

    // 3. Global search check (case-insensitive across multiple fields)
    if (options.search && options.search.query) {
      const queryLower = options.search.query.toLowerCase();
      const matchesSearch = options.search.fields.some((field) => {
        const itemValue = String(item[field] || "").toLowerCase();
        return itemValue.includes(queryLower);
      });

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}
