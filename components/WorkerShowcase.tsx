'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const workers = [
  {
    name: 'Alemayehu',
    role: 'Construction Specialist',
    location: 'Riyadh, Saudi Arabia',
    image: '/Alemayehu.webp',
    quote: 'The training gave me confidence. Now I lead a team of 15 workers.',
    skills: ['Welding', 'Safety Certified', 'Team Leadership'],
  },
  {
    name: 'Meron',
    role: 'Healthcare Assistant',
    location: 'Dubai, UAE',
    image: '/Meron.webp',
    quote: 'I never thought I could work abroad. Skills for Life made it possible.',
    skills: ['Patient Care', 'CPR Certified', 'Medical Terminology'],
  },
  {
    name: 'Selam',
    role: 'House Maid',
    location: 'Doha, Qatar',
    image: '/Selam.webp',
    quote: 'The certification opened doors I never knew existed.',
    skills: ['Household Management', 'Childcare', 'Professional Cleaning'],
  },
];

export default function WorkerShowcase() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-dark mb-6">
            {t('workers.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('workers.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workers.map((worker, index) => (
            <motion.div
              key={worker.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-soft card-hover border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={worker.image}
                  alt={worker.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 start-0 end-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{worker.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/90 mb-2">
                    <Briefcase size={14} />
                    <span>{worker.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin size={14} />
                    <span>{worker.location}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 italic mb-4 leading-relaxed">"{worker.quote}"</p>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-accent/20 to-accent/10 text-primary rounded-full text-xs font-bold border border-accent/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
