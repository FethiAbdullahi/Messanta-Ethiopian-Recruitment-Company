'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileSpreadsheet,
  ListChecks,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const PAGE = 40;

type Tab = 'form' | 'bulk' | 'list';

type Me = {
  profile?: { default_region?: string | null; role?: string } | null;
};

export type TalentRow = {
  id: string;
  created_at: string;
  updated_at?: string | null;
  created_by: string;
  region: string;
  source: string;
  full_name: string;
  gender: string | null;
  date_of_birth: string | null;
  phone: string;
  email: string | null;
  national_id: string | null;
  passport: string | null;
  current_address: string | null;
  city: string | null;
  woreda_subcity: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  highest_education: string | null;
  field_of_study: string | null;
  institution_name: string | null;
  graduation_year: string | null;
  languages: string | null;
  skills_summary: string | null;
  notes: string | null;
  submitted_by_name?: string | null;
};

type CelebrateState =
  | null
  | { type: 'form' }
  | { type: 'bulk'; summary: string };

const emptyForm = () => ({
  region: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  nationalId: '',
  passport: '',
  currentAddress: '',
  city: '',
  woredaSubcity: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  highestEducation: '',
  fieldOfStudy: '',
  institutionName: '',
  graduationYear: '',
  languages: '',
  skillsSummary: '',
  notes: '',
});

const inputClass =
  'w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  const { t } = useTranslation();
  const v = typeof value === 'string' ? value.trim() : '';
  const empty = t('desk.emptyField');
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-4 sm:items-start">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="text-sm leading-relaxed text-slate-800 break-words">{v.length > 0 ? v : empty}</dd>
    </div>
  );
}

export default function RegionalTalentsPortal() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('form');
  const [me, setMe] = useState<Me | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [setDefaultOnSubmit, setSetDefaultOnSubmit] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [defaultSavedMsg, setDefaultSavedMsg] = useState<string | null>(null);

  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkDefaultRegion, setBulkDefaultRegion] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkErr, setBulkErr] = useState<string | null>(null);

  const [rows, setRows] = useState<TalentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [scope, setScope] = useState<'mine' | 'all'>('mine');
  const [listLoading, setListLoading] = useState(false);
  const [listErr, setListErr] = useState<string | null>(null);

  const [celebrate, setCelebrate] = useState<CelebrateState>(null);
  const [detailRow, setDetailRow] = useState<TalentRow | null>(null);
  const modalStackRef = useRef({ detailRow: null as TalentRow | null, celebrate: null as CelebrateState });
  modalStackRef.current = { detailRow, celebrate };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const { detailRow: d, celebrate: c } = modalStackRef.current;
      if (d) setDetailRow(null);
      else if (c) setCelebrate(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const locked = Boolean(celebrate || detailRow);
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [celebrate, detailRow]);

  useEffect(() => {
    let c = false;
    fetch('/api/admin/me', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Me) => {
        if (c) return;
        setMe(d);
        const dr = d?.profile?.default_region?.trim();
        if (dr) {
          setForm((f) => ({ ...f, region: f.region || dr }));
          setBulkDefaultRegion((b) => b || dr);
        }
      })
      .catch(() => {});
    return () => {
      c = true;
    };
  }, []);

  const loadList = useCallback(
    async (nextOffset: number) => {
      setListLoading(true);
      setListErr(null);
      try {
        const qs = new URLSearchParams({ limit: String(PAGE), offset: String(nextOffset) });
        const res = await fetch(`/api/regional-talents?${qs}`, { credentials: 'include', cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('admin.loadError'));
        setRows((data.items ?? []) as TalentRow[]);
        setTotal(typeof data.total === 'number' ? data.total : 0);
        setOffset(nextOffset);
        setScope(data.scope === 'all' ? 'all' : 'mine');
      } catch (e) {
        setListErr(e instanceof Error ? e.message : t('admin.loadError'));
        setRows([]);
        setTotal(0);
      } finally {
        setListLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (tab === 'list') loadList(0);
  }, [tab, loadList]);

  const onChange =
    (field: keyof ReturnType<typeof emptyForm>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const saveDefaultRegionOnly = async () => {
    setFormErr(null);
    setDefaultSavedMsg(null);
    const region = form.region.trim();
    if (region.length < 2) {
      setFormErr(t('admin.regionalRegionRequired'));
      return;
    }
    const res = await fetch('/api/profile/default-region', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ defaultRegion: region }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setFormErr(typeof data.error === 'string' ? data.error : t('admin.saveError'));
      return;
    }
    setDefaultSavedMsg(t('admin.regionalDefaultSaved'));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormBusy(true);
    setFormErr(null);
    setDefaultSavedMsg(null);
    const savedProfileDefault = me?.profile?.default_region?.trim() ?? '';
    try {
      const res = await fetch('/api/regional-talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          setDefaultRegion: setDefaultOnSubmit,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : t('common.submitFailed'));
      if (data.defaultRegionUpdated) {
        setMe((m) => ({
          ...m,
          profile: { ...m?.profile, default_region: form.region.trim() },
        }));
      }
      setForm(() => {
        const base = emptyForm();
        const dr = (data.defaultRegionUpdated ? form.region.trim() : savedProfileDefault) || '';
        return dr.length >= 2 ? { ...base, region: dr } : base;
      });
      setCelebrate({ type: 'form' });
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : t('common.submitFailed'));
    } finally {
      setFormBusy(false);
    }
  };

  const submitBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) {
      setBulkErr(t('admin.regionalBulkNeedFile'));
      return;
    }
    setBulkBusy(true);
    setBulkErr(null);
    try {
      const fd = new FormData();
      fd.append('file', bulkFile);
      fd.append('defaultRegion', bulkDefaultRegion.trim());
      const res = await fetch('/api/regional-talents/bulk', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : t('common.submitFailed'));
      const summary = t('admin.regionalBulkDone')
        .replace('{n}', String(data.imported ?? 0))
        .replace('{s}', String(data.skipped ?? 0));
      setBulkFile(null);
      setCelebrate({ type: 'bulk', summary });
    } catch (err) {
      setBulkErr(err instanceof Error ? err.message : t('common.submitFailed'));
    } finally {
      setBulkBusy(false);
    }
  };

  const tabBtn = (id: Tab, label: string, Icon: typeof Upload) => (
    <button
      type="button"
      key={id}
      onClick={() => setTab(id)}
      className={`relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
        tab === id
          ? 'bg-white text-primary shadow-md ring-1 ring-primary/15'
          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
      }`}
    >
      {tab === id && (
        <motion.span
          layoutId="deskTabGlow"
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon size={18} className={tab === id ? 'text-primary' : 'text-slate-500'} />
        {label}
      </span>
    </button>
  );

  const hasPrev = offset > 0;
  const hasNext = offset + PAGE < total;
  const start = total === 0 ? 0 : offset + 1;
  const end = offset + rows.length;

  const openRow = (r: TalentRow) => setDetailRow(r);

  return (
    <div className="pb-16">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/25 text-primary shadow-inner ring-1 ring-white/80">
            <Sparkles size={28} strokeWidth={1.75} />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{t('desk.title')}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{t('desk.subtitle')}</p>
          <p className="mx-auto mt-4 max-w-2xl rounded-2xl border border-teal-100/80 bg-gradient-to-br from-teal-50/90 to-white px-5 py-3 text-xs leading-relaxed text-teal-900 shadow-sm ring-1 ring-teal-50 md:text-sm">
            {t('desk.fieldHint')}
          </p>
        </motion.div>
      </div>

      <div className="mx-auto mb-10 flex max-w-xl flex-wrap justify-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-1.5 shadow-inner">
        {tabBtn('form', t('admin.regionalTabForm'), FileSpreadsheet)}
        {tabBtn('bulk', t('admin.regionalTabBulk'), Upload)}
        {tabBtn('list', t('admin.regionalTabList'), ListChecks)}
      </div>

      {tab === 'form' && (
        <div className="mx-auto flex w-full max-w-3xl justify-center px-1 sm:px-0">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={submitForm}
            className="w-full space-y-8 rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(15,118,110,0.25)] ring-1 ring-slate-100 backdrop-blur-sm sm:p-10"
          >
            <div className="flex flex-wrap items-end gap-4 border-b border-slate-100 pb-6">
              <div className="min-w-[12rem] flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t('admin.regionalRegion')} *
                </label>
                <input
                  required
                  value={form.region}
                  onChange={onChange('region')}
                  className={inputClass}
                  placeholder={t('admin.regionalRegionPlaceholder')}
                />
                <p className="mt-2 text-xs text-slate-500">{t('admin.regionalRegionHint')}</p>
              </div>
              <button
                type="button"
                onClick={saveDefaultRegionOnly}
                className="shrink-0 rounded-xl border border-primary/35 bg-gradient-to-br from-primary/8 to-accent/10 px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/50 hover:from-primary/12"
              >
                {t('admin.regionalSaveDefaultRegion')}
              </button>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-700 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={setDefaultOnSubmit}
                onChange={(e) => setSetDefaultOnSubmit(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
              />
              <span>{t('admin.regionalSetDefaultOnSubmit')}</span>
            </label>

            {formErr && (
              <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">{formErr}</div>
            )}
            {defaultSavedMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">{defaultSavedMsg}</div>
            )}

            <section>
              <h3 className="mb-4 font-serif text-lg font-bold text-slate-900">{t('admin.regionalPersonalSection')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalFullName')} *</label>
                  <input required value={form.fullName} onChange={onChange('fullName')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalGender')}</label>
                  <select value={form.gender} onChange={onChange('gender')} className={inputClass}>
                    <option value="">{t('admin.regionalGenderPlaceholder')}</option>
                    <option value="Female">{t('admin.regionalGenderFemale')}</option>
                    <option value="Male">{t('admin.regionalGenderMale')}</option>
                    <option value="Other">{t('admin.regionalGenderOther')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalDob')}</label>
                  <input type="date" value={form.dateOfBirth} onChange={onChange('dateOfBirth')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalPhone')} *</label>
                  <input required value={form.phone} onChange={onChange('phone')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalEmail')}</label>
                  <input type="email" value={form.email} onChange={onChange('email')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalNationalId')}</label>
                  <input value={form.nationalId} onChange={onChange('nationalId')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalPassport')}</label>
                  <input value={form.passport} onChange={onChange('passport')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalAddress')}</label>
                  <input value={form.currentAddress} onChange={onChange('currentAddress')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalCity')}</label>
                  <input value={form.city} onChange={onChange('city')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalWoreda')}</label>
                  <input value={form.woredaSubcity} onChange={onChange('woredaSubcity')} className={inputClass} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 font-serif text-lg font-bold text-slate-900">{t('admin.regionalEmergencySection')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalEmergencyName')}</label>
                  <input value={form.emergencyContactName} onChange={onChange('emergencyContactName')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalEmergencyPhone')}</label>
                  <input value={form.emergencyContactPhone} onChange={onChange('emergencyContactPhone')} className={inputClass} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 font-serif text-lg font-bold text-slate-900">{t('admin.regionalEducationSection')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalHighestEducation')}</label>
                  <input value={form.highestEducation} onChange={onChange('highestEducation')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalFieldOfStudy')}</label>
                  <input value={form.fieldOfStudy} onChange={onChange('fieldOfStudy')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalInstitution')}</label>
                  <input value={form.institutionName} onChange={onChange('institutionName')} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalGradYear')}</label>
                  <input value={form.graduationYear} onChange={onChange('graduationYear')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalLanguages')}</label>
                  <input value={form.languages} onChange={onChange('languages')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalSkills')}</label>
                  <textarea rows={3} value={form.skillsSummary} onChange={onChange('skillsSummary')} className={`${inputClass} resize-none`} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{t('admin.regionalNotes')}</label>
                  <textarea rows={2} value={form.notes} onChange={onChange('notes')} className={`${inputClass} resize-none`} />
                </div>
              </div>
            </section>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={formBusy}
                className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-700 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-95 disabled:opacity-50"
              >
                {formBusy ? t('admin.regionalSubmitting') : t('admin.regionalSubmit')}
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {tab === 'bulk' && (
        <div className="mx-auto flex w-full max-w-xl justify-center px-1 sm:px-0">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submitBulk}
            className="w-full space-y-6 rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(15,118,110,0.2)] ring-1 ring-slate-100 sm:p-10"
          >
            <p className="text-center text-sm leading-relaxed text-slate-600">{t('admin.regionalBulkHint')}</p>
            <div>
              <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                {t('admin.regionalBulkDefaultRegion')}
              </label>
              <input
                value={bulkDefaultRegion}
                onChange={(e) => setBulkDefaultRegion(e.target.value)}
                className={inputClass}
                placeholder={t('admin.regionalBulkDefaultPlaceholder')}
              />
              <p className="mt-2 text-center text-xs text-slate-500">{t('admin.regionalBulkDefaultExplain')}</p>
            </div>
            <div>
              <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                {t('admin.regionalBulkChooseFile')}
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
                className="mx-auto block w-full max-w-md text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/15"
              />
            </div>
            <div className="text-center">
              <Link href="/regional-talents-sample.csv" className="text-sm font-semibold text-primary underline-offset-2 hover:underline" download>
                {t('admin.regionalBulkTemplate')}
              </Link>
            </div>
            {bulkErr && <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-center text-sm text-red-800">{bulkErr}</div>}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={bulkBusy}
                className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gradient-to-r from-primary to-teal-700 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {bulkBusy ? t('admin.regionalBulkUploading') : t('admin.regionalBulkUpload')}
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {tab === 'list' && (
        <div className="mx-auto w-full max-w-5xl px-1 sm:px-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              {scope === 'all' ? t('admin.regionalScopeAll') : t('admin.regionalScopeMine')}
            </p>
            <button
              type="button"
              onClick={() => loadList(offset)}
              disabled={listLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
            >
              <RefreshCw size={16} className={listLoading ? 'animate-spin' : ''} />
              {t('admin.regionalListRefresh')}
            </button>
          </div>
          <p className="mb-3 text-center text-xs text-slate-500 sm:text-sm">{t('desk.listClickHint')}</p>
          {listErr && <p className="mb-4 text-center text-sm text-red-600">{listErr}</p>}
          {listLoading ? (
            <p className="py-16 text-center text-slate-500">{t('common.loading')}</p>
          ) : rows.length === 0 ? (
            <p className="py-16 text-center text-slate-500">{t('admin.regionalListEmpty')}</p>
          ) : (
            <>
              <p className="mb-4 text-center text-sm text-slate-600">
                {t('admin.regionalPagination').replace('{start}', String(start)).replace('{end}', String(end)).replace('{total}', String(total))}
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/30">
                      <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3.5">{t('admin.regionalColWhen')}</th>
                        <th className="px-4 py-3.5">{t('admin.regionalColName')}</th>
                        <th className="px-4 py-3.5">{t('admin.regionalColRegion')}</th>
                        <th className="px-4 py-3.5">{t('admin.regionalColPhone')}</th>
                        <th className="px-4 py-3.5">{t('admin.regionalColSource')}</th>
                        {scope === 'all' && <th className="px-4 py-3.5">{t('admin.regionalColSubmittedBy')}</th>}
                        <th className="w-10 px-2 py-3.5" aria-hidden />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr
                          key={r.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openRow(r)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openRow(r);
                            }
                          }}
                          className="group cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-gradient-to-r hover:from-primary/[0.06] hover:to-teal-50/40 focus:bg-teal-50/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30"
                        >
                          <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{new Date(r.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">{r.full_name}</td>
                          <td className="px-4 py-3.5 text-slate-700">{r.region}</td>
                          <td className="px-4 py-3.5 text-slate-700">{r.phone}</td>
                          <td className="px-4 py-3.5 text-slate-500">{r.source}</td>
                          {scope === 'all' && <td className="px-4 py-3.5 text-slate-600">{r.submitted_by_name ?? '—'}</td>}
                          <td className="px-2 py-3.5 text-slate-400 transition group-hover:text-primary">
                            <ChevronRight size={18} className="mx-auto" aria-hidden />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {total > PAGE && (
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={() => loadList(Math.max(0, offset - PAGE))}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary/30 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    {t('admin.prevPage')}
                  </button>
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={() => loadList(offset + PAGE)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary/30 disabled:opacity-40"
                  >
                    {t('admin.nextPage')}
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <AnimatePresence>
        {celebrate && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-[200] bg-slate-900/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCelebrate(null)}
            />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="celebrate-title"
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-primary/10 ring-1 ring-slate-200/80"
              >
                <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 px-8 pb-8 pt-10 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner ring-4 ring-white">
                    <CheckCircle2 size={44} strokeWidth={1.5} />
                  </div>
                  <h2 id="celebrate-title" className="font-serif text-2xl font-bold text-slate-900">
                    {celebrate.type === 'bulk' ? t('desk.bulkSuccessTitle') : t('desk.successTitle')}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {celebrate.type === 'bulk' ? celebrate.summary : t('desk.successSubtitle')}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCelebrate(null);
                        setTab('list');
                        loadList(0);
                      }}
                      className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:opacity-95"
                    >
                      {t('desk.viewStudentList')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCelebrate(null);
                        setTab('form');
                      }}
                      className="rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-primary/30 hover:bg-primary/5"
                    >
                      {t('desk.addAnother')}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCelebrate(null)}
                    className="mt-4 text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
                  >
                    {t('desk.gotIt')}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailRow && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailRow(null)}
            />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="detail-title"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                className="pointer-events-auto flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-100"
              >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/40 px-6 py-5 sm:px-8">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{t('desk.detailTitle')}</p>
                    <h2 id="detail-title" className="mt-1 font-serif text-2xl font-bold text-slate-900">
                      {detailRow.full_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{t('desk.detailSubtitle')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailRow(null)}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-md"
                    aria-label={t('desk.closeDetails')}
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t('desk.sectionMeta')}</h3>
                  <dl className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/40 px-4 py-1">
                    <DetailField label={t('desk.metaRecordedAt')} value={new Date(detailRow.created_at).toLocaleString()} />
                    <DetailField label={t('desk.metaSource')} value={detailRow.source} />
                    <DetailField label={t('desk.metaRegion')} value={detailRow.region} />
                    {scope === 'all' && (
                      <DetailField label={t('desk.metaSubmittedBy')} value={detailRow.submitted_by_name ?? undefined} />
                    )}
                  </dl>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.regionalPersonalSection')}</h3>
                  <dl className="mb-8 rounded-2xl border border-slate-100 px-4 py-1">
                    <DetailField label={t('admin.regionalGender')} value={detailRow.gender} />
                    <DetailField label={t('admin.regionalDob')} value={detailRow.date_of_birth ?? undefined} />
                    <DetailField label={t('admin.regionalPhone')} value={detailRow.phone} />
                    <DetailField label={t('admin.regionalEmail')} value={detailRow.email} />
                    <DetailField label={t('admin.regionalNationalId')} value={detailRow.national_id} />
                    <DetailField label={t('admin.regionalPassport')} value={detailRow.passport} />
                    <DetailField label={t('admin.regionalAddress')} value={detailRow.current_address} />
                    <DetailField label={t('admin.regionalCity')} value={detailRow.city} />
                    <DetailField label={t('admin.regionalWoreda')} value={detailRow.woreda_subcity} />
                  </dl>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.regionalEmergencySection')}</h3>
                  <dl className="mb-8 rounded-2xl border border-slate-100 px-4 py-1">
                    <DetailField label={t('admin.regionalEmergencyName')} value={detailRow.emergency_contact_name} />
                    <DetailField label={t('admin.regionalEmergencyPhone')} value={detailRow.emergency_contact_phone} />
                  </dl>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.regionalEducationSection')}</h3>
                  <dl className="mb-8 rounded-2xl border border-slate-100 px-4 py-1">
                    <DetailField label={t('admin.regionalHighestEducation')} value={detailRow.highest_education} />
                    <DetailField label={t('admin.regionalFieldOfStudy')} value={detailRow.field_of_study} />
                    <DetailField label={t('admin.regionalInstitution')} value={detailRow.institution_name} />
                    <DetailField label={t('admin.regionalGradYear')} value={detailRow.graduation_year} />
                    <DetailField label={t('admin.regionalLanguages')} value={detailRow.languages} />
                    <DetailField label={t('admin.regionalSkills')} value={detailRow.skills_summary} />
                    <DetailField label={t('admin.regionalNotes')} value={detailRow.notes} />
                  </dl>
                </div>
                <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={() => setDetailRow(null)}
                    className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto sm:px-10"
                  >
                    {t('desk.closeDetails')}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
