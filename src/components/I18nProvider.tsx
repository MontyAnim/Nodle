"use client";

import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore } from '@/store/useLocaleStore';
import { useEffect, useState } from 'react';

import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';

const dictionaries = {
  en: enMessages,
  es: esMessages
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((state) => state.locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To prevent hydration mismatch, render the default locale (es) on the server.
  // Once mounted on the client, swap to the user's preferred locale.
  const currentLocale = mounted ? locale : 'es';
  const currentMessages = mounted ? dictionaries[locale] : dictionaries['es'];

  return (
    <NextIntlClientProvider locale={currentLocale} messages={currentMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
