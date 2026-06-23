import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import jobsData from '@/data/jobs.json';
import JobDetailClient from '@/components/JobDetailClient';

export async function generateStaticParams() {
  return jobsData.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = jobsData.find((j) => j.slug === params.slug);

  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: `${job.title} - Skills for Life Training`,
    description: job.description,
    openGraph: {
      title: `${job.title} - Skills for Life Training`,
      description: job.description,
      type: 'website',
    },
  };
}

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = jobsData.find((j) => j.slug === params.slug);

  if (!job) {
    notFound();
  }

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.posted_at,
    "employmentType": job.type,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Skills for Life Training PLC",
      "sameAs": "https://skillsforlife.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.split(',')[0],
        "addressCountry": job.location.includes('Ethiopia') ? "ET" : job.location.split(',')[1]?.trim() || "ET"
      }
    }
  };

  return (
    <>
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <JobDetailClient job={job} />
    </>
  );
}
