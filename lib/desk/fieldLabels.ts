export type DeskFieldKey =
  | 'region'
  | 'fullName'
  | 'gender'
  | 'dateOfBirth'
  | 'phone'
  | 'email'
  | 'nationalId'
  | 'passport'
  | 'employmentId'
  | 'currentAddress'
  | 'city'
  | 'woredaSubcity'
  | 'emergencyContactName'
  | 'emergencyContactPhone'
  | 'highestEducation'
  | 'fieldOfStudy'
  | 'institutionName'
  | 'graduationYear'
  | 'languages'
  | 'skillsSummary'
  | 'notes'
  | 'metaRecordedAt'
  | 'metaSource'
  | 'metaSubmittedBy'
  | 'metaRegion'
  | 'bulkDefaultRegion'
  | 'bulkChooseFile';

export const DESK_FIELD_LABELS: Record<DeskFieldKey, { en: string; am: string }> = {
  region: { en: 'Region', am: 'ክልል' },
  fullName: { en: 'Full name', am: 'ሙሉ ስም' },
  gender: { en: 'Gender', am: 'ጾታ' },
  dateOfBirth: { en: 'Date of birth', am: 'የልደት ቀን' },
  phone: { en: 'Phone', am: 'ስልክ' },
  email: { en: 'Email', am: 'ኢሜይል' },
  nationalId: { en: 'National ID', am: 'ብሔራዊ መታወቂያ' },
  passport: { en: 'Passport', am: 'ፓስፖርት' },
  employmentId: { en: 'Employment ID', am: 'የስራ መታወቂያ' },
  currentAddress: { en: 'Current address', am: 'አድራሻ' },
  city: { en: 'City / town', am: 'ከተማ' },
  woredaSubcity: { en: 'Woreda / subcity', am: 'ወረዳ' },
  emergencyContactName: { en: 'Emergency contact name', am: 'የአስቸኳይ ስም' },
  emergencyContactPhone: { en: 'Emergency contact phone', am: 'የአስቸኳይ ስልክ' },
  highestEducation: { en: 'Highest education', am: 'ከፍተኛ ትምህርት' },
  fieldOfStudy: { en: 'Field of study', am: 'የትምህርት መስክ' },
  institutionName: { en: 'Institution name', am: 'ተቋም' },
  graduationYear: { en: 'Graduation year', am: 'የመጨረሻ ዓመት' },
  languages: { en: 'Languages', am: 'ቋንቋዎች' },
  skillsSummary: { en: 'Skills summary', am: 'ክህሎት ማጠቃለያ' },
  notes: { en: 'Internal notes', am: 'ማስታወሻ' },
  metaRecordedAt: { en: 'Recorded', am: 'የተቀመጠ' },
  metaSource: { en: 'Source', am: 'ምንጭ' },
  metaSubmittedBy: { en: 'Submitted by', am: 'ያስገባ' },
  metaRegion: { en: 'Region', am: 'ክልል' },
  bulkDefaultRegion: { en: 'Default region (if rows omit region)', am: 'ነባሪ ክልል (ክልል ከሌለ)' },
  bulkChooseFile: { en: 'CSV or Excel file', am: 'CSV ወይም Excel ፋይል' },
};

export const DESK_SECTION_LABELS = {
  personal: { en: 'Personal details', am: 'የግል ዝርዝር' },
  emergency: { en: 'Emergency contact', am: 'የአስቸኳይ አድራሻ' },
  education: { en: 'Education & skills', am: 'ትምህርት እና ክህሎት' },
  meta: { en: 'Record', am: 'መዝገብ' },
} as const;

export const DESK_GENDER_OPTIONS = [
  { value: 'Female', en: 'Female', am: 'ሴት' },
  { value: 'Male', en: 'Male', am: 'ወንድ' },
  { value: 'Other', en: 'Other / prefer not to say', am: 'ሌላ' },
] as const;

export function deskFieldLabel(field: DeskFieldKey): { en: string; am: string } {
  return DESK_FIELD_LABELS[field];
}
