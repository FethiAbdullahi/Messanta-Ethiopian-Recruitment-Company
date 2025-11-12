'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Award, Globe, Download, UserCheck } from 'lucide-react';
import { useState } from 'react';
import RequestShortlistModal from './RequestShortlistModal';

type Candidate = {
  id: string;
  name: string;
  age: number;
  location: string;
  skills: string[];
  program_completed: string;
  certification_date: string;
  availability: string;
  experience: string;
  languages: string[];
  destination_preference: string;
  image: string;
  cv_url: string;
};

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

export default function CandidateCard({ candidate, index }: CandidateCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-soft card-hover overflow-hidden group border border-gray-100"
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={candidate.image}
            alt={candidate.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4">
            <span className="px-4 py-1.5 bg-gradient-to-r from-accent to-accent/80 text-white rounded-full text-xs font-bold shadow-medium backdrop-blur-sm">
              {candidate.availability}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-dark mb-3 font-serif">{candidate.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {candidate.location}
            </span>
            <span>Age {candidate.age}</span>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-xs font-bold border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Program Completed */}
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Award size={16} className="text-accent" />
            <span className="text-gray-600">{candidate.program_completed}</span>
          </div>

          {/* Experience Preview */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{candidate.experience}</p>

          {/* Languages */}
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Globe size={16} className="text-accent" />
            <span className="text-gray-600">{candidate.languages.join(', ')}</span>
          </div>

          {/* Destination Preference */}
          <p className="text-sm text-gray-500 mb-4">
            Preferred: {candidate.destination_preference}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 px-5 py-2.5 gradient-accent text-white rounded-full text-sm font-bold hover:scale-105 transition-all duration-300 shadow-medium hover:shadow-lg flex items-center justify-center gap-2"
            >
              <UserCheck size={18} />
              Request Shortlist
            </button>
            {candidate.cv_url && candidate.cv_url !== '#' && (
              <a
                href={candidate.cv_url}
                download
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                CV
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <RequestShortlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={candidate}
      />
    </>
  );
}

