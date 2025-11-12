'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Users, Globe, Award, Heart } from 'lucide-react';

const metrics = [
  { icon: Users, value: 500, label: 'Candidates Placed', suffix: '+' },
  { icon: Globe, value: 15, label: 'Countries', suffix: '+' },
  { icon: Award, value: 95, label: 'Success Rate', suffix: '%' },
  { icon: Heart, value: 1000, label: 'Lives Changed', suffix: '+' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function AboutMission() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Worker Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 rounded-3xl overflow-hidden shadow-strong"
          >
            <Image
              src="/smiling-construction-worker-hard-hat-generative-ai_561855-74493.avif"
              alt="Smiling construction worker with hard hat"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
          </motion.div>

          {/* Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              At Skills for Life Training PLC, we believe that every individual deserves access to
              quality education and skill development. Our mission is to empower people with the
              knowledge and skills needed to transform their lives and build successful careers.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We combine professional training programs with practical, hands-on learning to deliver
              exceptional results for our students and partners. Every training program is a step
              toward a more skilled, confident, and prosperous future.
            </p>
            <p className="text-lg text-gray-700">
              Trust, excellence, and genuine care for our students are at the heart of everything we do.
            </p>
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                  <Icon className="text-white" size={28} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                <p className="text-gray-600">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

