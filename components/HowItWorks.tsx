'use client';

import { motion } from 'framer-motion';
import { FileSearch, Handshake, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    title: 'Choose Your Program',
    description: 'Browse our training programs and find the one that matches your career goals. Our team is here to help you choose.',
    number: '01',
  },
  {
    icon: Handshake,
    title: 'Enroll & Learn',
    description: 'Enroll in your chosen program and begin your learning journey with expert instructors and practical training.',
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Launch Your Career',
    description: 'Complete your training with confidence. We provide ongoing career support and job placement assistance.',
    number: '03',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, transparent process designed to help you achieve your career goals through quality training
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-light p-8 rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-dark font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

