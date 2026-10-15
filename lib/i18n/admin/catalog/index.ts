import type { CatalogNode, CatalogKey } from '../text';
import { common } from './common';
import { shell } from './shell';
import { dashboard } from './dashboard';
import { pages } from './pages';
import { editor } from './editor';
import { navigation } from './navigation';
import { news } from './news';
import { inbox } from './inbox';
import { account } from './account';
import { users } from './users';
import { login } from './login';
import { categories } from './categories';
import { products } from './products';
import { home } from './home';

/** Every admin string, by area. Add new areas here; keys are checked by the compiler wherever `T`/`t` are used. */
export const adminCatalog = {
  common,
  ...shell,
  ...dashboard,
  ...pages,
  ...editor,
  ...navigation,
  ...news,
  ...inbox,
  ...account,
  ...users,
  ...login,
  ...categories,
  ...products,
  ...home,
} as const satisfies CatalogNode;

export type AdminKey = CatalogKey<typeof adminCatalog>;
