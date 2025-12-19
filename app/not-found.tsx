'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-light flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-4">
          {t('notFound.title')}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t('notFound.description')}
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform"
        >
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  );
}
