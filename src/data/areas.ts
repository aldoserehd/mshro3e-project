/**
 * Kuwait residential areas used for the home location picker + delivery filters.
 * `id` 'all' is the unfiltered default. Keep ar/en in sync.
 */
export interface Area {
  id: string;
  ar: string;
  en: string;
}

export const KUWAIT_AREAS: Area[] = [
  { id: 'all', ar: 'كل الكويت', en: 'All Kuwait' },
  { id: 'salmiya', ar: 'السالمية', en: 'Salmiya' },
  { id: 'hawally', ar: 'حولي', en: 'Hawally' },
  { id: 'jabriya', ar: 'الجابرية', en: 'Jabriya' },
  { id: 'salwa', ar: 'سلوى', en: 'Salwa' },
  { id: 'rumaithiya', ar: 'الرميثية', en: 'Rumaithiya' },
  { id: 'bayan', ar: 'بيان', en: 'Bayan' },
  { id: 'mishref', ar: 'مشرف', en: 'Mishref' },
  { id: 'sabah_al_salem', ar: 'صباح السالم', en: 'Sabah Al Salem' },
  { id: 'kuwait_city', ar: 'مدينة الكويت', en: 'Kuwait City' },
  { id: 'farwaniya', ar: 'الفروانية', en: 'Farwaniya' },
  { id: 'fintas', ar: 'الفنطاس', en: 'Fintas' },
  { id: 'egaila', ar: 'العقيلة', en: 'Egaila' },
  { id: 'mangaf', ar: 'المنقف', en: 'Mangaf' },
  { id: 'ahmadi', ar: 'الأحمدي', en: 'Ahmadi' },
  { id: 'jahra', ar: 'الجهراء', en: 'Jahra' },
];
