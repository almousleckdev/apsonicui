import type { CatalogNode, CatalogKey } from '../text';
import { common } from './common';
import { shell } from './shell';
import { dashboard } from './dashboard';
import { pages } from './pages';
import { editor } from './editor';
import { navigation } from './navigation';
import { news } from './news';

/** Every admin string, by area. Add new areas here; keys are checked by the compiler wherever `T`/`t` are used. */
export const adminCatalog = {
  common,
  ...shell,
  ...dashboard,
  ...pages,
  ...editor,
  ...navigation,
  ...news,
} as const satisfies CatalogNode;

export type AdminKey = CatalogKey<typeof adminCatalog>;
