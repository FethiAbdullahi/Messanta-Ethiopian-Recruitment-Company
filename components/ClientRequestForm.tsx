'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ClientRequestForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    rolesRequested: '',
    numberOfWorkers: '',
    startDate: '',
    jobDescription: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/employer-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(typeof data.error === 'string' ? data.error : t('common.submitFailed'));
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          companyName: '',
          country: '',
          contactPerson: '',
          email: '',
          phone: '',
          rolesRequested: '',
          numberOfWorkers: '',
          startDate: '',
          jobDescription: '',
          notes: '',
        });
      }, 5000);
    } catch {
      setSubmitError(t('common.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-serif font-bold text-dark mb-6">{t('modals.workerRequestForm')}</h2>

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          <h3 className="text-2xl font-semibold text-dark mb-2">{t('modals.requestSubmitted')}</h3>
          <p className="text-gray-600">
            {t('modals.requestReceived')}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.companyName')} *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.country')} *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                placeholder={t('forms.countryPlaceholder')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.contactPerson')} *
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.phone')} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="numberOfWorkers" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.numberOfWorkers')} *
              </label>
              <input
                type="number"
                id="numberOfWorkers"
                name="numberOfWorkers"
                required
                min="1"
                value={formData.numberOfWorkers}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="rolesRequested" className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.rolesRequested')} *
            </label>
            <input
              type="text"
              id="rolesRequested"
              name="rolesRequested"
              required
              value={formData.rolesRequested}
              onChange={handleChange}
              placeholder={t('forms.rolesPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.preferredStartDate')} *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.jobDescription')} *
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={4}
              required
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder={t('forms.jobDescPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.additionalNotes')}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder={t('forms.notesPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {submitError ? (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>{t('forms.submitting')}</>
            ) : (
              <>
                <Send size={20} />
                {t('forms.submitRequest')}
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
