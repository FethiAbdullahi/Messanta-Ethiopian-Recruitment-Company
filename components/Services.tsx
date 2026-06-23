'use client';

import { motion } from 'framer-motion';
import { Users, Search, GraduationCap, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Users,
      title: t('services.professionalTraining'),
      description: t('services.professionalTrainingDesc'),
    },
    {
      icon: Search,
      title: t('services.skillAssessment'),
      description: t('services.skillAssessmentDesc'),
    },
    {
      icon: GraduationCap,
      title: t('services.careerDevelopment'),
      description: t('services.careerDevelopmentDesc'),
    },
    {
      icon: Globe,
      title: t('services.jobPlacement'),
      description: t('services.jobPlacementDesc'),
    },
  ];

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white p-8 rounded-2xl shadow-soft card-hover border border-gray-100 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-medium">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-3 font-serif">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
