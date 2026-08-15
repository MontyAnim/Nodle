import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to read locale from cookies, default to 'es'
  const locale = 'es';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
