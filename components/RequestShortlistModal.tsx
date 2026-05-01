'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Candidate {
  id: string;
  name: string;
}

interface RequestShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

export default function RequestShortlistModal({
  isOpen,
  onClose,
  candidate,
}: RequestShortlistModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
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
      const res = await fetch('/api/shortlist-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          candidateName: candidate.name,
          ...formData,
        }),
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
          contactPerson: '',
          email: '',
          phone: '',
          country: '',
          notes: '',
        });
        onClose();
      }, 3000);
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-dark">
                  {t('modals.requestShortlist')}: {candidate.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={t('common.close')}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                    <h3 className="text-2xl font-semibold text-dark mb-2">{t('modals.requestSubmitted')}</h3>
                    <p className="text-gray-600">
                      {t('modals.requestReceivedProfile').replace('{name}', candidate.name)}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-6">
                      {t('modals.shortlistFormNote')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('forms.additionalNotes')}
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={4}
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

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? t('forms.submitting') : t('forms.submitRequest')}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-6 py-3 bg-gray-100 text-dark rounded-full font-medium hover:bg-gray-200 transition-colors"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
