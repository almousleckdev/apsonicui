/**
 * The African countries where APSONIC is present. This is the single list behind the green countries on the map,
 * the search box ("Gabon", "Côte d'Ivoire", "加蓬"...) and which countries can be clicked.
 *
 * To add or remove a country, change this list only.
 */
export interface ApsonicCountry {
  /** ISO 3166-1 alpha-3 code: the key used to match the map shapes. */
  iso3: string;
  /** English name. This is the canonical name used by the stores and the search box. */
  name: string;
  /** Other ways to write or type the country: French, Chinese, short forms. */
  aliases: string[];
}

export const APSONIC_COUNTRIES: readonly ApsonicCountry[] = [
  // West Africa
  { iso3: 'GHA', name: 'Ghana', aliases: ['加纳'] },
  { iso3: 'TGO', name: 'Togo', aliases: ['多哥'] },
  { iso3: 'BEN', name: 'Benin', aliases: ['bénin', '贝宁'] },
  { iso3: 'MLI', name: 'Mali', aliases: ['马里'] },
  { iso3: 'SEN', name: 'Senegal', aliases: ['sénégal', '塞内加尔'] },
  { iso3: 'NGA', name: 'Nigeria', aliases: ['nigéria', '尼日利亚'] },
  { iso3: 'CIV', name: 'Ivory Coast', aliases: ["côte d'ivoire", "cote d'ivoire", '科特迪瓦'] },
  { iso3: 'BFA', name: 'Burkina Faso', aliases: ['burkina', '布基纳法索'] },
  { iso3: 'NER', name: 'Niger', aliases: ['尼日尔'] },
  { iso3: 'GIN', name: 'Guinea', aliases: ['guinée', '几内亚'] },
  { iso3: 'LBR', name: 'Liberia', aliases: ['libéria', '利比里亚'] },
  { iso3: 'SLE', name: 'Sierra Leone', aliases: ['塞拉利昂'] },
  { iso3: 'GMB', name: 'Gambia', aliases: ['the gambia', 'gambie', '冈比亚'] },
  // Central Africa
  { iso3: 'CMR', name: 'Cameroon', aliases: ['cameroun', '喀麦隆'] },
  { iso3: 'GAB', name: 'Gabon', aliases: ['加蓬'] },
  { iso3: 'CAF', name: 'Central African Republic', aliases: ['car', 'république centrafricaine', 'centrafrique', '中非', '中非共和国'] },
  { iso3: 'COG', name: 'Congo', aliases: ['republic of the congo', 'congo-brazzaville', 'congo brazzaville', '刚果', '刚果共和国', '刚果(布)'] },
  {
    iso3: 'COD',
    name: 'Democratic Republic of Congo',
    aliases: ['dr congo', 'drc', 'rd congo', 'rdc', 'democratic republic of the congo', 'république démocratique du congo', 'congo-kinshasa', 'congo kinshasa', '民主刚果', '刚果金', '刚果(金)'],
  },
  // East Africa
  { iso3: 'TZA', name: 'Tanzania', aliases: ['tanzanie', 'united republic of tanzania', '坦桑尼亚'] },
  { iso3: 'KEN', name: 'Kenya', aliases: ['肯尼亚'] },
  { iso3: 'UGA', name: 'Uganda', aliases: ['ouganda', '乌干达'] },
];

/** Lower case, no accents, single spaces: so "Côte d'Ivoire", "cote d'ivoire" and "COTE D’IVOIRE" are the same. */
export const normalizeCountryQuery = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const namesOf = (country: ApsonicCountry): string[] =>
  [country.name, ...country.aliases].map(normalizeCountryQuery);

const APSONIC_ISO3 = new Set(APSONIC_COUNTRIES.map((c) => c.iso3));

export const isApsonicIso3 = (iso3: string | undefined | null): boolean => !!iso3 && APSONIC_ISO3.has(iso3.toUpperCase());

export const getApsonicCountryByIso3 = (iso3: string | undefined | null): ApsonicCountry | null =>
  APSONIC_COUNTRIES.find((c) => c.iso3 === iso3?.toUpperCase()) ?? null;

const hasCjk = (value: string): boolean => /[㐀-鿿]/.test(value);

/**
 * Finds the APSONIC country a person means from what they typed.
 *
 * - A full name or alias always matches ("gabon", "Côte d'Ivoire", "刚果金").
 * - A partial name matches only while it points to exactly one country and has at least 3 letters (1 for Chinese),
 *   so "gab" finds Gabon, but "gu" (Guinea? Gambia?) waits for more letters instead of jumping to the wrong country.
 */
export const findApsonicCountry = (query: string): ApsonicCountry | null => {
  const q = normalizeCountryQuery(query);
  if (!q) return null;

  const exact = APSONIC_COUNTRIES.find((c) => namesOf(c).includes(q));
  if (exact) return exact;

  const minLength = hasCjk(q) ? 1 : 3;
  if (q.length < minLength) return null;
  const partial = APSONIC_COUNTRIES.filter((c) => namesOf(c).some((name) => name.startsWith(q)));
  return partial.length === 1 ? partial[0] : null;
};
