'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Award } from 'lucide-react';
import candidatesData from '@/data/candidates.json';
import CandidateCard from '@/components/CandidateCard';

type Candidate = typeof candidatesData[0];

const allSkills = Array.from(new Set(candidatesData.flatMap(c => c.skills)));
const allDestinations = Array.from(new Set(candidatesData.map(c => c.destination_preference)));

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCandidates = useMemo(() => {
    return candidatesData.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every(skill => candidate.skills.includes(skill));

      const matchesDestination =
        selectedDestination === 'All' ||
        candidate.destination_preference === selectedDestination;

      return matchesSearch && matchesSkills && matchesDestination;
    });
  }, [searchQuery, selectedSkills, selectedDestination]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedDestination('All');
  };

  const activeFiltersCount =
    (selectedSkills.length > 0 ? 1 : 0) +
    (selectedDestination !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 relative"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-4">
              Trained Candidates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our database of certified, trained workers ready for international employment.
              All candidates have completed our comprehensive training programs.
            </p>
          </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, skills, or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-dark transition-colors"
              >
                <X size={18} />
                Clear all
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-300 mb-4"
            >
              {/* Skills Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Preference
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="All">All Destinations</option>
                  {allDestinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Award size={16} className="text-accent" />
            Showing <span className="font-semibold">{filteredCandidates.length}</span> certified candidate{filteredCandidates.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-gray-600 text-lg mb-4">No candidates found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="text-accent hover:text-primary transition-colors"
            >
              Clear filters to see all candidates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

