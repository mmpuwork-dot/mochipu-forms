import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ja', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
