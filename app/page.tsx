import Hero from '@/components/Hero';
import StorySection from '@/components/StorySection';
import WorkerShowcase from '@/components/WorkerShowcase';
import Services from '@/components/Services';
import PathToDeployment from '@/components/PathToDeployment';
import AboutMission from '@/components/AboutMission';

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <WorkerShowcase />
      <Services />
      <PathToDeployment />
      <AboutMission />
    </>
  );
}

