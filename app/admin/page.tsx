'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Calendar, MessageSquare } from 'lucide-react';
import jobsData from '@/data/jobs.json';
import { useTranslation } from '@/hooks/useTranslation';

// Simple password protection (in production, use proper authentication)
const ADMIN_PASSWORD = 'skillsforlife2024';

export default function AdminPage() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadInquiries();
    }
  }, []);

  const loadInquiries = () => {
    // In production, fetch from Supabase
    // For now, load from localStorage if available
    const stored = localStorage.getItem('contact_inquiries');
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading inquiries:', e);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadInquiries();
      setError('');
    } else {
      setError(t('admin.incorrectPassword'));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-light flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Lock className="text-primary" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-dark mb-4 text-center">
            {t('admin.adminAccess')}
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('admin.passwordPlaceholder')}
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform"
            >
              {t('admin.login')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark mb-2">{t('admin.title')}</h1>
            <p className="text-gray-600">{t('admin.subtitle')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-200 text-dark rounded-full font-medium hover:bg-gray-300 transition-colors"
          >
            {t('admin.logout')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-serif font-bold text-dark mb-4">{t('admin.activeJobs')}</h2>
            <div className="space-y-3">
              {jobsData.map((job) => (
                <div key={job.id} className="border-b pb-3 last:border-0">
                  <h3 className="font-semibold text-dark">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">{t('admin.total')}: {jobsData.length} {t('jobs.jobsPlural')}</p>
          </motion.div>

          {/* Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-serif font-bold text-dark mb-4">{t('admin.contactInquiries')}</h2>
            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <Mail className="text-accent flex-shrink-0 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{inquiry.name}</p>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        <Calendar size={14} className="inline me-1" />
                        {new Date(inquiry.date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      <MessageSquare size={14} className="inline me-1 text-accent" />
                      {inquiry.subject}: {inquiry.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {t('admin.noInquiries')}
              </p>
            )}
          </motion.div>
        </div>

        {/* Seed Data Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-serif font-bold text-dark mb-4">{t('admin.seedData')}</h2>
          <p className="text-gray-600 mb-4">
            {t('admin.seedDataInfo')} <code className="bg-gray-100 px-2 py-1 rounded">data/jobs.json</code>.
            {t('admin.seedDataNote')}
          </p>
          <p className="text-sm text-gray-500">
            {t('admin.productionNote')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
