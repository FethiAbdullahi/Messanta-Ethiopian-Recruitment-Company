'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-4">Skills for Life Training PLC</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footer.brandDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-accent transition-colors">
                  {t('navigation.browseJobs')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                  {t('navigation.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('navigation.contact')}</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+251955888885" className="hover:text-accent transition-colors">
                  +251 955 88 88 85
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:info@skillsforlife.com" className="hover:text-accent transition-colors">
                  info@skillsforlife.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>{t('footer.copyright').replace('{year}', currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
}
