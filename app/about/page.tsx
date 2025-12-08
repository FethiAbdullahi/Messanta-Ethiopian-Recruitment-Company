'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Target, Users, Award, Shield, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Human-Centered',
    description: 'We prioritize people over processes. Every interaction is personal, respectful, and meaningful.',
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'We maintain the highest standards in training, ensuring quality education and exceptional learning experiences.',
  },
  {
    icon: Users,
    title: 'Trust',
    description: 'Transparency and integrity guide everything we do. We build lasting relationships based on trust.',
  },
  {
    icon: Award,
    title: 'Impact',
    description: 'We measure success by the positive impact we create in people\'s lives and communities.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Skills for Life Training PLC was founded with a vision to empower individuals through quality education and skill development.',
  },
  {
    year: '2021',
    title: 'First Placements',
    description: 'Successfully graduated our first cohort of students with industry-ready skills.',
  },
  {
    year: '2022',
    title: 'Expansion',
    description: 'Expanded our training programs and established partnerships with leading organizations and employers.',
  },
  {
    year: '2023',
    title: 'Recognition',
    description: 'Recognized as a leading training institution in Ethiopia with 500+ successful graduates.',
  },
  {
    year: '2024',
    title: 'Innovation',
    description: 'Launched digital platform and enhanced training programs with modern learning technologies.',
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-white via-light to-white">
      {/* Modern Hero Section with Worker Images Background */}
      <section className="relative min-h-screen overflow-hidden mb-20 -mt-24 pt-24">
        {/* Modern Background - Worker Images Collage */}
        <div className="absolute inset-0">
          {/* Image Grid Background - Representing Different Professions */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-20">
            {/* House Maid */}
            <div className="relative overflow-hidden">
              <Image
                src="/main-maid.webp"
                alt="House maid"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
            {/* Training Scene */}
            <div className="relative overflow-hidden">
              <Image
                src="/training.webp"
                alt="Training session"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
            {/* Healthcare Worker */}
            <div className="relative overflow-hidden">
              <Image
                src="/nurse-tenderly-supports-elderly-woman-wheelchair.avif"
                alt="Healthcare worker"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
            {/* Construction Worker */}
            <div className="relative overflow-hidden">
              <Image
                src="/smiling-construction-worker-hard-hat-generative-ai_561855-74493.avif"
                alt="Construction worker"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
            {/* Interview */}
            <div className="relative overflow-hidden">
              <Image
                src="/interview.webp"
                alt="Interview"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
            {/* Graduation */}
            <div className="relative overflow-hidden">
              <Image
                src="/graduation.webp"
                alt="Graduation"
                fill
                className="object-cover scale-110"
                sizes="33vw"
              />
            </div>
          </div>
          
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-dark/85 to-dark/90"></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0.05) 20px)`
            }}></div>
          </div>
        </div>

        {/* Content Layer - Always Visible */}
        <div className="relative z-20 min-h-[85vh] md:min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content with Creative Design */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-lg px-6 py-3 rounded-full border border-white/30 shadow-lg"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white font-semibold text-sm uppercase tracking-wider">About Us</span>
                </motion.div>

                {/* Main Headline with Creative Typography */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight"
                >
                  <span className="block text-white mb-2 drop-shadow-2xl">Our</span>
                  <span className="block text-white drop-shadow-2xl">
                    Story
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-xl drop-shadow-lg font-light"
                >
                  Transforming lives through training, trust, and opportunity. Every worker has a story — we help write the next chapter.
                </motion.p>

                {/* Stats or Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="flex flex-wrap gap-6 pt-4"
                >
                  <div className="bg-white/15 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
                    <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">500+</div>
                    <div className="text-white/90 text-sm font-medium">Workers Placed</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
                    <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">15+</div>
                    <div className="text-white/90 text-sm font-medium">Countries</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
                    <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">95%</div>
                    <div className="text-white/90 text-sm font-medium">Success Rate</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Image Card with Creative Overlay */}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="relative hidden lg:block"
              >
                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/First-image-generated-DALLE-3-when-prompted-show-me-a-photo-of-a-maid.png"
                    alt="House maids and workers"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dark/40 via-transparent to-dark/30"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-2xl border border-white/50">
                    <div className="text-sm text-gray-600 mb-1 font-medium">Since 2020</div>
                    <div className="text-2xl font-bold text-dark">Building Futures</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/80 text-sm font-medium drop-shadow-md">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission Section - Storytelling Style */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-strong">
                <Image
                  src="/maid.webp"  
                  alt="House maids and workers in training session"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent"></div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="text-accent font-bold text-sm uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-8 leading-tight">
                Empowering Lives,<br />
                <span className="text-gradient">One Story at a Time</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Skills for Life Training PLC transforms how Ethiopian workers access safe, well-paid opportunities abroad.
                  We combine industry-focused training, rigorous compliance support, and transparent processes to prepare
                  candidates for international work.
                </p>
                <p>
                  Our goal is to remove barriers, eliminate hidden costs, and equip every trainee with practical skills and
                  guidance so they can thrive overseas and return with experience that strengthens their communities.
                </p>
                <p className="font-semibold text-dark">
                  We believe in a human-first approach that prioritizes worker safety, fair treatment, and long-term success
                  for both workers and employers.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section - Modern Cards */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider mb-4 block">What Drives Us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision, every training program, and every relationship we build.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white p-8 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-100 hover:border-accent/30"
                >
                  <div className="w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Goals & Objectives Section - Modern Grid */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider mb-4 block">Our Commitment</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-6">
              Goals & Objectives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our goals are to make overseas employment safe, fair and sustainable for Ethiopian workers. We focus on:
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Regular Legal Status', desc: 'Ensuring workers have accurate, lawful passport, visa, and work permit arrangements.' },
              { icon: Target, title: 'Fair Costs', desc: 'Maintaining transparent and reasonable fee structures to prevent unnecessary expenses.' },
              { icon: Heart, title: 'Worker Safety', desc: 'Prioritizing protection from exploitation, abuse, and forced labor through vetting, contracts, and support.' },
              { icon: TrendingUp, title: 'Reintegration & Impact', desc: 'Enabling returning workers to share skills and spark local development.' },
              { icon: Globe, title: 'National Representation', desc: 'Promoting Ethiopia\'s cultural strengths and professionalism abroad.' },
              { icon: Users, title: 'Job Creation', desc: 'Partnering with authorities and employers to expand opportunities for citizens.' },
              { icon: Award, title: 'Responsible Remittance', desc: 'Guiding workers to use secure, legal channels for sending money home, supporting national prosperity.', span: 'md:col-span-2 lg:col-span-3' },
            ].map((goal, index) => {
              const Icon = goal.icon;
              return (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-primary/30 group ${goal.span || ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-medium group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-3">{goal.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{goal.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Timeline Section - Modern Storytelling */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider mb-4 block">Our Evolution</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a vision to a movement — milestones that shaped who we are today.
            </p>
          </motion.div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-primary to-accent/50 transform md:-translate-x-1/2 rounded-full"></div>

            {/* Timeline Items */}
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full transform md:-translate-x-1/2 z-10 shadow-medium"></div>

                  {/* Content */}
                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold text-accent">{item.year}</div>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent to-transparent"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-dark mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section - Showcase */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider mb-4 block">Who We Serve</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark mb-6">
              Our Workers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our dedicated team of training specialists, career counselors, and support staff
              work together to ensure the best learning outcomes for our students.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { src: '/smiling-construction-worker-hard-hat-generative-ai_561855-74493.avif', alt: 'Construction workers', title: 'Construction Workers', desc: 'Skilled professionals building futures' },
              { src: '/nurse-tenderly-supports-elderly-woman-wheelchair.avif', alt: 'Healthcare workers', title: 'Healthcare Workers', desc: 'Compassionate caregivers making a difference' },  
              { src: '/main-maid.webp', alt: 'House Maids', title: 'House Maids', desc: 'Dedicated professionals creating comfortable homes' },
            ].map((worker, index) => (
              <motion.div
                key={worker.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-strong hover:shadow-xl transition-all duration-500"
              >
                <Image
                  src={worker.src}
                  alt={worker.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{worker.title}</h3>
                  <p className="text-white/90 text-sm">{worker.desc}</p>
                </div>
                {/* Decorative Corner */}
                <div className="absolute top-6 right-6 w-12 h-12 border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

