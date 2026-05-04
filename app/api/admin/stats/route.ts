import { requireAdminOrSuper } from '@/lib/auth/requireAdminOrSuper';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

export async function GET() {
  const gate = await requireAdminOrSuper();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const a = gate.admin;
  const [enrollments, contact, employer, shortlist, regionalTalents] = await Promise.all([
    a.from('enrollments').select('id', { count: 'exact', head: true }),
    a.from('contact_submissions').select('id', { count: 'exact', head: true }),
    a.from('employer_requests').select('id', { count: 'exact', head: true }),
    a.from('shortlist_requests').select('id', { count: 'exact', head: true }),
    a.from('regional_talents').select('id', { count: 'exact', head: true }),
  ]);

  const pick = (r: { count: number | null; error: unknown }, label: string) => {
    if (r.error) {
      console.error(`[admin/stats] ${label}`, r.error);
      return 0;
    }
    return r.count ?? 0;
  };

  return jsonNoStore({
    enrollments: pick(enrollments, 'enrollments'),
    contact: pick(contact, 'contact_submissions'),
    employer: pick(employer, 'employer_requests'),
    shortlist: pick(shortlist, 'shortlist_requests'),
    regionalTalents: pick(regionalTalents, 'regional_talents'),
  });
}
