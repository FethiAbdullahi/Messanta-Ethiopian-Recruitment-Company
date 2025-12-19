'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Blurred Background Image - More Visible */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/Gemini_Generated_Image_zkg9nzkg9nzkg9nz.png"
            alt="House maids and workers" 
            fill
            className="object-cover scale-110 blur-[2px]"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Lighter Overlay for Better Background Visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark/60 via-dark/55 to-dark/65"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0.05) 20px)`
          }}></div>
        </div>
      </div>

      {/* Content Layer - Beautiful Flow */}
      <div className="relative z-20 w-full h-full flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 sm:py-10 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Side - Text Content with Beautiful Flow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-5 sm:space-y-6 lg:space-y-8 text-center lg:text-start"
            >
              {/* Headline - Beautiful Typography Flow */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.1] text-white drop-shadow-2xl"
              >
                <span className="block">{t('hero.everyJourney')}</span>
                <span className="block">{t('hero.starts')}</span>
                <span className="block text-accent">{t('hero.withSingleStep')}</span>
              </motion.h1>

              {/* Subheadline - Elegant Spacing */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-white/95 font-light leading-relaxed drop-shadow-lg mt-4 sm:mt-5 lg:mt-6"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* CTAs - Responsive and Beautiful */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-3"
              >
                <Link
                  href="/programs"
                  className="btn-primary gradient-accent text-white shadow-strong hover:shadow-xl text-sm sm:text-base lg:text-lg px-5 sm:px-7 lg:px-10 py-2.5 sm:py-3 lg:py-4 text-center"
                >
                  {t('hero.startYourJourney')}
                </Link>
                <Link
                  href="/#story"
                  className="btn-secondary border-2 border-white/50 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-sm sm:text-base lg:text-lg px-5 sm:px-7 lg:px-10 py-2.5 sm:py-3 lg:py-4 text-center"
                >
                  {t('hero.readSuccessStories')}
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Clean Image Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md lg:max-w-none h-[280px] sm:h-[350px] md:h-[420px] lg:h-[550px] xl:h-[600px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/Gemini_Generated_Image_zkg9nzkg9nzkg9nz.png"
                  alt="Main maid"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark/40 via-transparent to-dark/30"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Responsive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-8 start-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-white/5"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1.5 sm:mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
