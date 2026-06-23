import { redirect } from 'next/navigation';

/** Old path; field teams use the short URL `/desk` instead. */
export default function LegacyRegionalTalentsRedirect() {
  redirect('/desk');
}
