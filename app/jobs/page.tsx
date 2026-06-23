'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Briefcase, Search, Filter, X } from 'lucide-react';
import jobsData from '@/data/jobs.json';
import { useTranslation } from '@/hooks/useTranslation';

type Job = typeof jobsData[0];

const categories = ['All', ...Array.from(new Set(jobsData.map(job => job.category)))];
const locations = ['All', ...Array.from(new Set(jobsData.map(job => job.location)))];
const types = ['All', ...Array.from(new Set(jobsData.map(job => job.type)))];

export default function JobsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
      const matchesType = selectedType === 'All' || job.type === selectedType;

      return matchesSearch && matchesCategory && matchesLocation && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedLocation, selectedType]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedType('All');
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-4">
            {t('jobs.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('jobs.subtitle')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute start-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('jobs.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-12 pe-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              {t('common.filters')}
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
                {t('common.clearAll')}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobs.category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? t('common.all') : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobs.location')}
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? t('common.all') : loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('jobs.employmentType')}
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type === 'All' ? t('common.all') : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {t('jobs.showing')} <span className="font-semibold">{filteredJobs.length}</span> {filteredJobs.length !== 1 ? t('jobs.jobsPlural') : t('jobs.job')}
          </div>
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="text-2xl font-semibold text-dark hover:text-accent transition-colors mb-2 block"
                    >
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {job.type}
                      </span>
                      <span className="px-2 py-1 bg-accent/20 text-primary rounded text-xs font-medium">
                        {job.category}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="inline-block px-6 py-3 bg-primary text-white rounded-full font-medium hover:scale-105 transition-transform"
                    >
                      {t('jobs.viewDetails')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <p className="text-gray-600 text-lg mb-4">{t('jobs.noResults')}</p>
              <button
                onClick={clearFilters}
                className="text-accent hover:text-primary transition-colors"
              >
                {t('jobs.clearFiltersToSee')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
