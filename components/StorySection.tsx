'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function StorySection() {
  const { t, isRTL } = useTranslation();

  const storySteps = [
    {
      title: t('story.steps.beginning.title'),
      subtitle: t('story.steps.beginning.subtitle'),
      description: t('story.steps.beginning.description'),
      image: '/interview2.webp',
      imageAlt: 'Worker interview session',
      color: 'from-primary/20 to-accent/20',
    },
    {
      title: t('story.steps.training.title'),
      subtitle: t('story.steps.training.subtitle'),
      description: t('story.steps.training.description'),
      image: '/training2.webp',
      imageAlt: 'Workers in training session',
      color: 'from-accent/20 to-secondary/20',
    },
    {
      title: t('story.steps.certification.title'),
      subtitle: t('story.steps.certification.subtitle'),
      description: t('story.steps.certification.description'),
      image: '/graduation.webp',
      imageAlt: 'Worker graduation ceremony',
      color: 'from-secondary/20 to-primary/20',
    },
    {
      title: t('story.steps.placement.title'),
      subtitle: t('story.steps.placement.subtitle'),
      description: t('story.steps.placement.description'),
      image: '/main-maid.webp',
      imageAlt: 'Main maid',
      color: 'from-primary/20 to-accent/20',
    },
    {
      title: t('story.steps.impact.title'),
      subtitle: t('story.steps.impact.subtitle'),
      description: t('story.steps.impact.description'),
      image: '/Hana.webp',
      imageAlt: 'Successful worker with family',
      color: 'from-accent/20 to-secondary/20',
    },
  ];

  return (
    <section id="story" className="py-24 md:py-32 bg-gradient-to-b from-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-dark mb-6">
            {t('story.title')}
          </h2>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light">
            {t('story.subtitle')}
          </p>
        </motion.div>

        {/* Story Steps */}
        <div className="space-y-32">
          {storySteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-strong ${
                  index % 2 === 1 ? 'lg:col-start-2' : ''
                }`}
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-60`}></div>
                <div className="absolute bottom-0 start-0 end-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-xl">
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {step.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">
                    {step.title}
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  {index < storySteps.length - 1 && (
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <span>{t('story.continueJourney')}</span>
                      <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-12 rounded-3xl border border-primary/20">
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-6">
              {t('story.cta.title')}
            </h3>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              {t('story.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/programs"
                className="btn-primary gradient-accent text-white shadow-strong hover:shadow-xl"
              >
                {t('story.cta.explorePrograms')}
              </a>
              <a
                href="/candidates"
                className="btn-secondary border-2 border-primary text-primary hover:bg-primary/10"
              >
                {t('story.cta.viewSuccessStories')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
