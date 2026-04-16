'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import programsData from '@/data/programs.json';
import EnrollModal from '@/components/EnrollModal';
import { useTranslation } from '@/hooks/useTranslation';

type Program = (typeof programsData)[number];

function formatProgramStart(nextStart: string, startsLabel: string): string {
  const trimmed = nextStart.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) {
      return `${startsLabel} ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  }
  return trimmed;
}

export default function ProgramsPage() {
  const { t, isRTL } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEnroll = (program: Program) => {
    if (program.comingSoon) return;
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="pt-32 pb-20 min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">
              {t('programs.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('programs.subtitle')}
            </p>
          </motion.div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programsData.map((program, index) => {
              const isComingSoon = program.comingSoon === true;
              const curriculumPreview = isComingSoon
                ? program.curriculum.slice(0, 3)
                : program.curriculum;
              const moreCount =
                isComingSoon && program.curriculum.length > 3
                  ? program.curriculum.length - 3
                  : 0;

              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-soft card-hover overflow-hidden border border-gray-100 relative"
                >
                  {isComingSoon && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/50 px-6 text-center backdrop-blur-md">
                      <span className="rounded-full bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-medium">
                        {t('programs.comingSoon')}
                      </span>
                      <p className="max-w-xs text-sm text-gray-600">{t('programs.comingSoonHint')}</p>
                    </div>
                  )}

                  <div
                    className={`relative z-10 p-8 ${isComingSoon ? 'pointer-events-none select-none blur-[6px]' : ''}`}
                  >
                    {/* Category Badge */}
                    <span className="mb-4 inline-block rounded-full border border-accent/30 bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-1.5 text-sm font-bold text-primary">
                      {program.category}
                    </span>

                    {/* Title */}
                    <h2 className="mb-4 font-serif text-2xl font-bold text-dark md:text-3xl">{program.title}</h2>

                    {/* Description */}
                    <p className="mb-4 text-gray-600">{program.description}</p>

                    {'highlights' in program && program.highlights && program.highlights.length > 0 && (
                      <ul className="mb-6 space-y-1">
                        {program.highlights.map((line, hi) => (
                          <li key={hi} className="text-sm font-medium text-primary">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Details Grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Clock size={18} className="mt-0.5 shrink-0" />
                        <span className="text-sm">
                          {program.duration}
                          {'duration_extra' in program &&
                          typeof program.duration_extra === 'string' &&
                          program.duration_extra ? (
                            <span className="mt-0.5 block text-xs text-gray-500">{program.duration_extra}</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <DollarSign size={18} className="mt-0.5 shrink-0" />
                        <span className="text-sm font-semibold text-primary">
                          {program.price}
                          {'price_extra' in program &&
                          typeof program.price_extra === 'string' &&
                          program.price_extra ? (
                            <span className="mt-0.5 block text-xs font-semibold text-primary/90">{program.price_extra}</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap size={18} />
                        <span className="text-sm">{t('programs.certified')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} />
                        <span className="text-sm">
                          {formatProgramStart(program.next_start, t('programs.starts'))}
                        </span>
                      </div>
                    </div>

                    {/* Price Note */}
                    <p className="mb-6 text-sm font-medium text-accent">{program.price_note}</p>

                    {/* Curriculum Preview */}
                    <div className="mb-6">
                      <h3 className="mb-2 text-sm font-semibold text-dark">{t('programs.curriculumIncludes')}</h3>
                      <ul className="space-y-1">
                        {curriculumPreview.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <ArrowRight size={14} className={`shrink-0 text-accent ${isRTL ? 'rotate-180' : ''}`} />
                            {item}
                          </li>
                        ))}
                        {moreCount > 0 && (
                          <li className="text-sm text-gray-500">
                            {t('programs.moreModules').replace('{count}', String(moreCount))}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => handleEnroll(program)}
                      disabled={isComingSoon}
                      className={`w-full rounded-full px-6 py-3.5 font-bold shadow-medium transition-all duration-300 ${
                        isComingSoon
                          ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                          : 'gradient-primary text-white hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      {isComingSoon ? t('programs.comingSoon') : t('programs.enrollNow')}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-12 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-8 text-center shadow-soft"
          >
            <div className="relative z-10">
              <h3 className="mb-4 font-serif text-2xl font-bold text-dark md:text-3xl">
                {t('programs.transparentPricing')}
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">{t('programs.transparentPricingText')}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedProgram && !selectedProgram.comingSoon && (
        <EnrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          program={selectedProgram}
        />
      )}
    </>
  );
}
