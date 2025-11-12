'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Mail } from 'lucide-react';
import ApplyModal from './ApplyModal';

type Job = {
  id: string;
  title: string;
  location: string;
  category: string;
  type: string;
  slug: string;
  description: string;
  requirements?: string;
  posted_at: string;
  apply_email: string;
};

export default function JobDetailClient({ job }: { job: Job }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <>
      <div className="pt-32 pb-20 min-h-screen bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-8 mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
              <span className="flex items-center gap-2">
                <MapPin size={20} />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={20} />
                {job.type}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={20} />
                Posted {new Date(job.posted_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-accent/20 text-primary rounded-full text-sm font-medium">
                {job.category}
              </span>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform"
              >
                Apply Now
              </button>
            </div>
          </motion.div>

          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-8 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-serif font-bold text-dark mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-dark mb-4">Requirements</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold text-dark mb-4">How to Apply</h3>
              <p className="text-gray-700 mb-4">
                Interested candidates can apply using the button above or email us directly at:
              </p>
              <a
                href={`mailto:${job.apply_email}?subject=Application for ${job.title}`}
                className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors"
              >
                <Mail size={20} />
                {job.apply_email}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        applyEmail={job.apply_email}
      />
    </>
  );
}

