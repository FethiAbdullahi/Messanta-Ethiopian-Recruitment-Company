'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, FileText, Users, Globe, CheckCircle2 } from 'lucide-react';
import ClientRequestForm from '@/components/ClientRequestForm';
import { useTranslation } from '@/hooks/useTranslation';

export default function ClientsPage() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  const processSteps = [
    {
      icon: FileText,
      title: t('clients.processSteps.submitRequest'),
      description: t('clients.processSteps.submitRequestDesc'),
    },
    {
      icon: Users,
      title: t('clients.processSteps.candidateMatching'),
      description: t('clients.processSteps.candidateMatchingDesc'),
    },
    {
      icon: CheckCircle,
      title: t('clients.processSteps.selectionVerification'),
      description: t('clients.processSteps.selectionVerificationDesc'),
    },
    {
      icon: Globe,
      title: t('clients.processSteps.placementSupport'),
      description: t('clients.processSteps.placementSupportDesc'),
    },
  ];

  const complianceFeatures = [
    t('clients.complianceFeatures.passportVisa'),
    t('clients.complianceFeatures.workPermit'),
    t('clients.complianceFeatures.contractVerification'),
    t('clients.complianceFeatures.preDeparture'),
    t('clients.complianceFeatures.onSiteSupport'),
    t('clients.complianceFeatures.reintegration'),
  ];

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
            {t('clients.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('clients.subtitle')}
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform text-lg"
          >
            {showForm ? t('clients.hideRequestForm') : t('clients.requestWorkers')}
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
            {t('clients.whyChooseUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">{t('clients.fullyTrained')}</h3>
              <p className="text-gray-600">
                {t('clients.fullyTrainedDesc')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">{t('clients.complianceGuaranteed')}</h3>
              <p className="text-gray-600">
                {t('clients.complianceGuaranteedDesc')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold text-dark mb-2">{t('clients.ongoingSupport')}</h3>
              <p className="text-gray-600">
                {t('clients.ongoingSupportDesc')}
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
            {t('clients.ourProcess')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="text-white" size={28} />
                      <div className="absolute -top-2 -end-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-sm">
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
            {t('clients.complianceServices')}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {t('clients.complianceServicesText')}
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
            {t('clients.transparentPricingTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t('clients.transparentPricingText')}
          </p>
          <p className="text-gray-700">
            {t('clients.contactForQuote')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
