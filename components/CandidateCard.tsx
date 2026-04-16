'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Award, Globe, Download, UserCheck } from 'lucide-react';
import { useState } from 'react';
import RequestShortlistModal from './RequestShortlistModal';
import { useTranslation } from '@/hooks/useTranslation';

type Candidate = {
  id: string;
  name: string;
  age: number;
  location: string;
  skills: string[];
  program_completed: string;
  certification_date: string;
  availability: string;
  experience: string;
  languages: string[];
  destination_preference: string;
  image: string;
  cv_url: string;
  cv_protected?: boolean;
};

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

export default function CandidateCard({ candidate, index }: CandidateCardProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvNotice, setCvNotice] = useState<string | null>(null);

  const showCvButton =
    candidate.cv_protected === true || (candidate.cv_url && candidate.cv_url !== '#');

  const handleCvAction = async () => {
    if (!candidate.cv_protected && candidate.cv_url && candidate.cv_url !== '#') {
      window.open(candidate.cv_url, '_blank', 'noopener,noreferrer');
      return;
    }

    setCvLoading(true);
    try {
      const res = await fetch(`/api/cv/${encodeURIComponent(candidate.id)}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent('/candidates')}`;
        return;
      }
      if (res.status === 403) {
        setCvNotice(t('candidates.cvUnauthorized'));
        return;
      }
      if (res.status === 404) {
        setCvNotice(t('candidates.cvNotAvailable'));
        return;
      }
      if (!res.ok || !data.url) {
        setCvNotice(t('candidates.cvOpenError'));
        return;
      }
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setCvNotice(t('candidates.cvOpenError'));
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft card-hover"
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={candidate.image}
            alt={candidate.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute end-4 top-4">
            <span className="rounded-full bg-gradient-to-r from-accent to-accent/80 px-4 py-1.5 text-xs font-bold text-white shadow-medium backdrop-blur-sm">
              {candidate.availability}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-3 font-serif text-2xl font-bold text-dark">{candidate.name}</h3>
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {candidate.location}
            </span>
            <span>
              {t('candidates.age')} {candidate.age}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 text-xs font-bold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm">
            <Award size={16} className="text-accent" />
            <span className="text-gray-600">{candidate.program_completed}</span>
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-gray-600">{candidate.experience}</p>

          <div className="mb-4 flex items-center gap-2 text-sm">
            <Globe size={16} className="text-accent" />
            <span className="text-gray-600">{candidate.languages.join(', ')}</span>
          </div>

          <p className="mb-4 text-sm text-gray-500">
            {t('candidates.preferred')}: {candidate.destination_preference}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent/90 px-5 py-2.5 text-sm font-bold text-white shadow-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <UserCheck size={18} />
              {t('candidates.requestShortlist')}
            </button>
            {showCvButton && (
              <button
                type="button"
                onClick={handleCvAction}
                disabled={cvLoading}
                className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <Download size={16} />
                {cvLoading ? t('common.loading') : t('candidates.downloadCV')}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <RequestShortlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={candidate}
      />

      <AnimatePresence>
        {cvNotice && (
          <motion.div
            key="cv-notice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={() => setCvNotice(null)}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cv-notice-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
              <h2 id="cv-notice-title" className="font-serif text-lg font-bold text-dark">
                {t('candidates.downloadCV')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{cvNotice}</p>
              <button
                type="button"
                onClick={() => setCvNotice(null)}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-primary to-primary/90 py-3 text-sm font-semibold text-white shadow-medium transition hover:opacity-95"
              >
                {t('candidates.cvDialogGotIt')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
