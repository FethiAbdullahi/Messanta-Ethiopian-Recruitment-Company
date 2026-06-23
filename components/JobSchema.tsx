import jobsData from '@/data/jobs.json';

export default function JobSchema() {
  const jobPostings = jobsData.map((job) => ({
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
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostings) }}
    />
  );
}

