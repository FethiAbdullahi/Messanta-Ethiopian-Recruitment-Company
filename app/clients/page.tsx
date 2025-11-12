'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, FileText, Users, Globe, Clock, CheckCircle2 } from 'lucide-react';
import ClientRequestForm from '@/components/ClientRequestForm';

const processSteps = [
  {
    icon: FileText,
    title: 'Submit Request',
    description: 'Fill out our simple request form with your requirements and timeline.',
  },
  {
    icon: Users,
    title: 'Candidate Matching',
    description: 'Our team reviews your needs and presents qualified, trained candidates.',
  },
  {
    icon: CheckCircle,
    title: 'Selection & Verification',
    description: 'You select candidates. We handle all documentation and verification.',
  },
  {
    icon: Globe,
    title: 'Placement & Support',
    description: 'We facilitate safe placement and provide ongoing support throughout employment.',
  },
];

const complianceFeatures = [
  'Legal passport and visa processing',
  'Work permit documentation',
  'Contract verification and translation',
  'Pre-departure orientation',
  'On-site support and protection',
  'Reintegration assistance',
];

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-dark mb-6">
            For Employers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access vetted, trained Ethiopian workers ready for international employment.
            Transparent process, no hidden fees, comprehensive compliance support.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform text-lg"
          >
            {showForm ? 'Hide Request Form' : 'Request Workers'}
          </button>
        </motion.div>

        {/* Request Form Section */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <ClientRequestForm />
          </motion.div>
        )}

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-8 text-center">
            Why Choose Skills for Life?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">Fully Trained & Certified</h3>
              <p className="text-gray-600">
                All candidates complete comprehensive training programs and receive internationally recognized certifications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">Compliance Guaranteed</h3>
              <p className="text-gray-600">
                We handle all legal documentation, work permits, and visa processing to ensure full compliance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">Ongoing Support</h3>
              <p className="text-gray-600">
                We provide continuous support throughout employment, ensuring worker satisfaction and retention.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-8 text-center">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="text-white" size={28} />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Compliance Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-lg shadow-sm mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-6">
            Compliance & Support Services
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We handle all aspects of legal compliance and documentation, ensuring a smooth, transparent process:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-lg shadow-sm text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            We believe in complete transparency. All fees are clearly stated upfront with no hidden costs.
            Pricing varies based on destination country, role requirements, and number of workers needed.
          </p>
          <p className="text-gray-700">
            Contact us for a detailed quote tailored to your specific needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

