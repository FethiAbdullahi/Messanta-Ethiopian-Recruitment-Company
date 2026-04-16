'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Program {
  id: string;
  title: string;
  enroll_email?: string;
}

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
}

export default function EnrollModal({ isOpen, onClose, program }: EnrollModalProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    nationalId: '',
    passport: '',
    phone: '',
    email: '',
    experience: '',
    cvLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    formRef.current?.reset();
    setFormData({
      fullName: '',
      dob: '',
      nationalId: '',
      passport: '',
      phone: '',
      email: '',
      experience: '',
      cvLink: '',
    });
    setIsSuccess(false);
    setError(null);
  }, [program.id, program.title, isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('programId', program.id);
    fd.set('programTitle', program.title);

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        if (res.status === 429) {
          setError(t('forms.enrollmentRateLimited'));
        } else {
          setError(data.error ?? t('forms.enrollmentError'));
        }
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError(t('forms.enrollmentError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    formRef.current?.reset();
    setFormData({
      fullName: '',
      dob: '',
      nationalId: '',
      passport: '',
      phone: '',
      email: '',
      experience: '',
      cvLink: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
              <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                <h2 className="font-serif text-2xl font-bold text-dark">
                  {t('modals.enrollIn')} {program.title}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
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
                    className="py-8 text-center"
                  >
                    <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                    <h3 className="mb-2 text-2xl font-semibold text-dark">{t('modals.enrollmentSubmitted')}</h3>
                    <p className="mb-2 text-gray-600">{t('modals.enrollmentReceived')}</p>
                    <p className="mb-8 text-sm text-gray-500">{t('modals.enrollmentConfirmationNote')}</p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full bg-primary px-8 py-3 font-semibold text-white hover:opacity-95"
                    >
                      {t('common.close')}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <p className="mb-6 text-gray-600">{t('modals.enrollmentFormNote')}</p>

                    {error && (
                      <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                        {error}
                      </p>
                    )}

                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      encType="multipart/form-data"
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="enroll-fullName" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('forms.fullName')} *
                        </label>
                        <input
                          type="text"
                          id="enroll-fullName"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="enroll-dob" className="mb-1 block text-sm font-medium text-gray-700">
                            {t('forms.dateOfBirth')} *
                          </label>
                          <input
                            type="date"
                            id="enroll-dob"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div>
                          <label htmlFor="enroll-phone" className="mb-1 block text-sm font-medium text-gray-700">
                            {t('forms.phoneNumber')} *
                          </label>
                          <input
                            type="tel"
                            id="enroll-phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="enroll-email" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('forms.emailAddress')} *
                        </label>
                        <input
                          type="email"
                          id="enroll-email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="enroll-nationalId" className="mb-1 block text-sm font-medium text-gray-700">
                            {t('forms.nationalId')} *
                          </label>
                          <input
                            type="text"
                            id="enroll-nationalId"
                            name="nationalId"
                            required
                            value={formData.nationalId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div>
                          <label htmlFor="enroll-passport" className="mb-1 block text-sm font-medium text-gray-700">
                            {t('forms.passport')}
                          </label>
                          <input
                            type="text"
                            id="enroll-passport"
                            name="passport"
                            value={formData.passport}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="enroll-experience" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('forms.experience')}
                        </label>
                        <textarea
                          id="enroll-experience"
                          name="experience"
                          rows={3}
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder={t('forms.experiencePlaceholder')}
                          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label htmlFor="enroll-cvFile" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('forms.cvFile')}
                        </label>
                        <input
                          type="file"
                          id="enroll-cvFile"
                          name="cvFile"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="w-full text-sm text-gray-600 file:me-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-4 file:py-2 file:font-semibold file:text-primary"
                        />
                        <p className="mt-1 text-xs text-gray-500">{t('forms.cvFileHint')}</p>
                      </div>

                      <div>
                        <label htmlFor="enroll-cvLink" className="mb-1 block text-sm font-medium text-gray-700">
                          {t('forms.cvLink')}
                        </label>
                        <input
                          type="url"
                          id="enroll-cvLink"
                          name="cvLink"
                          value={formData.cvLink}
                          onChange={handleChange}
                          placeholder={t('forms.cvLinkPlaceholder')}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 rounded-full bg-primary px-6 py-3 font-medium text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? t('forms.submitting') : t('forms.submitEnrollment')}
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="rounded-full bg-gray-100 px-6 py-3 font-medium text-dark transition-colors hover:bg-gray-200"
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
