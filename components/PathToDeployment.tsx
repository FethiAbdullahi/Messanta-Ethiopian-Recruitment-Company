'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, Plane, Shield, Home } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PathToDeployment() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: GraduationCap,
      title: t('path.steps.training.title'),
      description: t('path.steps.training.description'),
      color: 'bg-accent/20 text-primary',
    },
    {
      icon: Award,
      title: t('path.steps.certification.title'),
      description: t('path.steps.certification.description'),
      color: 'bg-primary/20 text-primary',
    },
    {
      icon: Plane,
      title: t('path.steps.placement.title'),
      description: t('path.steps.placement.description'),
      color: 'bg-accent/20 text-primary',
    },
    {
      icon: Shield,
      title: t('path.steps.support.title'),
      description: t('path.steps.support.description'),
      color: 'bg-primary/20 text-primary',
    },
    {
      icon: Home,
      title: t('path.steps.reintegration.title'),
      description: t('path.steps.reintegration.description'),
      color: 'bg-accent/20 text-primary',
    },
  ];

  return (
    <section ref={containerRef} className="py-20 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-4">
            {t('path.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('path.subtitle')}
          </p>
        </motion.div>

        {/* Horizontal Scrollable Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 start-0 end-0 h-1 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 start-1/2 transform -translate-x-1/2 w-10 h-10 gradient-accent rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-medium">
                    {index + 1}
                  </div>

                  {/* Icon Circle */}
                  <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 group shadow-medium`}>
                    <Icon size={40} className="relative z-10 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
