export type RouteKey = 'portfolio' | 'blog' | 'about' | 'contact';

export const routes: Record<'en' | 'vi', Record<RouteKey, string>> = {
  en: {
    portfolio: '/portfolio',
    blog: '/blog',
    about: '/about',
    contact: '/contact',
  },
  vi: {
    portfolio: '/du-an',
    blog: '/tin-tuc',
    about: '/gioi-thieu',
    contact: '/lien-he',
  },
};

export function getRoute(key: RouteKey, language: string): string {
  const lang = language === 'vi' ? 'vi' : 'en';
  return routes[lang][key];
}

export function translatePath(path: string, toLang: 'en' | 'vi'): string {
  const fromLang: 'en' | 'vi' = toLang === 'en' ? 'vi' : 'en';
  const fromRoutes = routes[fromLang];
  const toRoutes = routes[toLang];

  for (const key of Object.keys(fromRoutes) as RouteKey[]) {
    const fromBase = fromRoutes[key];
    if (path === fromBase || path.startsWith(fromBase + '/')) {
      const toBase = toRoutes[key];
      return path.replace(fromBase, toBase);
    }
  }

  for (const key of Object.keys(toRoutes) as RouteKey[]) {
    const base = toRoutes[key];
    if (path === base || path.startsWith(base + '/')) {
      return path;
    }
  }

  return path;
}
