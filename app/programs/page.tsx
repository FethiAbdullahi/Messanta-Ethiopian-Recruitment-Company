'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import programsData from '@/data/programs.json';
import EnrollModal from '@/components/EnrollModal';
import { useTranslation } from '@/hooks/useTranslation';

type Program = typeof programsData[0];

export default function ProgramsPage() {
  const { t, isRTL } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEnroll = (program: Program) => {
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
            {programsData.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft card-hover overflow-hidden border border-gray-100 relative"
              >
                <div className="p-8 relative z-10">
                  {/* Category Badge */}
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-accent/20 to-accent/10 text-primary rounded-full text-sm font-bold mb-4 border border-accent/30">
                    {program.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-dark mb-4">
                    {program.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{program.description}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} />
                      <span className="text-sm">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={18} />
                      <span className="text-sm font-semibold text-primary">{program.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap size={18} />
                      <span className="text-sm">{t('programs.certified')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />
                      <span className="text-sm">{t('programs.starts')} {new Date(program.next_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Price Note */}
                  <p className="text-sm text-accent mb-6 font-medium">
                    {program.price_note}
                  </p>

                  {/* Curriculum Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-dark mb-2">{t('programs.curriculumIncludes')}</h3>
                    <ul className="space-y-1">
                      {program.curriculum.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <ArrowRight size={14} className={`text-accent ${isRTL ? 'rotate-180' : ''}`} />
                          {item}
                        </li>
                      ))}
                      {program.curriculum.length > 3 && (
                        <li className="text-sm text-gray-500">
                          {t('programs.moreModules').replace('{count}', String(program.curriculum.length - 3))}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleEnroll(program)}
                    className="w-full px-6 py-3.5 gradient-primary text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-medium hover:shadow-lg"
                  >
                    {t('programs.enrollNow')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-8 rounded-2xl shadow-soft text-center border border-primary/10 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-dark mb-4">
                {t('programs.transparentPricing')}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                {t('programs.transparentPricingText')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedProgram && (
        <EnrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          program={selectedProgram}
        />
      )}
    </>
  );
}
