import { deskFieldLabel, DESK_SECTION_LABELS, type DeskFieldKey } from '@/lib/desk/fieldLabels';

type DeskFieldLabelProps = {
  field: DeskFieldKey;
  required?: boolean;
  className?: string;
  centered?: boolean;
};

export function DeskFieldLabel({ field, required, className = '', centered }: DeskFieldLabelProps) {
  const { en, am } = deskFieldLabel(field);
  return (
    <span className={`block ${centered ? 'text-center' : ''} ${className}`.trim()}>
      <span className="block text-xs font-bold uppercase tracking-wide text-slate-700">
        {en}
        {required ? ' *' : ''}
      </span>
      <span className="mt-0.5 block text-xs font-semibold normal-case tracking-normal text-slate-500">{am}</span>
    </span>
  );
}

type DeskSectionTitleProps = {
  section: keyof typeof DESK_SECTION_LABELS;
  className?: string;
};

export function DeskSectionTitle({ section, className = '' }: DeskSectionTitleProps) {
  const { en, am } = DESK_SECTION_LABELS[section];
  return (
    <h3 className={`mb-4 font-serif text-lg font-bold text-slate-900 ${className}`.trim()}>
      <span className="block">{en}</span>
      <span className="mt-0.5 block text-sm font-semibold text-slate-500">{am}</span>
    </h3>
  );
}
