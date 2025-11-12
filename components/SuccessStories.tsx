'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const stories = [
  {
    name: 'Alemayehu T.',
    role: 'Construction Worker',
    location: 'Addis Ababa → Riyadh',
    quote: 'Skills for Life Training helped me develop the skills I needed for international construction work. The training and support were exceptional.',
    image: '/Alemayehu.webp',
  },
  {
    name: 'Meron K.',
    role: 'Healthcare Assistant',
    location: 'Addis Ababa → Dubai',
    quote: 'I never imagined I could work internationally. Skills for Life Training prepared me with the right skills and supported me every step of the way.',
    image: '/Meron.webp',
  },
  {
    name: 'Selam W.',
    role: 'House Maid',
    location: 'Addis Ababa → Doha',
    quote: 'The training and preparation I received before placement was invaluable. I felt confident and ready for my new role.',
    image: '/Selam.webp',
  },
];

export default function SuccessStories() {
  return (
    <section id="success" className="py-24 md:py-32 bg-gradient-to-b from-white to-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-dark mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Real journeys of candidates we've helped place in meaningful careers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-white rounded-3xl overflow-hidden group border border-gray-100 shadow-soft card-hover"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
              </div>
              <div className="p-6 bg-white">
                <Quote className="text-primary mb-4" size={32} />
                <p className="text-gray-700 mb-4 italic text-lg leading-relaxed">"{story.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-dark text-lg">{story.name}</p>
                  <p className="text-sm text-gray-600">{story.role}</p>
                  <p className="text-sm text-primary font-semibold mt-1">{story.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

