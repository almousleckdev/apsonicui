export type AfricaRegion = 'west' | 'central' | 'east' | 'north' | 'southern';

export interface CountryInfo {
  code: string; // ISO 2-letter code, e.g. ML, GH, TG
  iso3: string;
  name: string;
  flag: string; // Flag emoji
  dialCode: string; // International calling code, e.g. +223
  region?: AfricaRegion;
  aliases?: string[];
  presence?: string;
}

export const COUNTRY_LIST: CountryInfo[] = [
  { code: 'ML', iso3: 'MLI', name: 'Mali', flag: '🇲🇱', dialCode: '+223', region: 'west', aliases: ['mali'], presence: 'Official Branch & Assembly' },
  { code: 'GH', iso3: 'GHA', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', region: 'west', aliases: ['ghana'], presence: 'Regional HQ' },
  { code: 'TG', iso3: 'TGO', name: 'Togo', flag: '🇹🇬', dialCode: '+228', region: 'west', aliases: ['togo'], presence: 'Dealer Network' },
  { code: 'SN', iso3: 'SEN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221', region: 'west', aliases: ['senegal'], presence: 'Dealer Network' },
  { code: 'NG', iso3: 'NGA', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', region: 'west', aliases: ['nigeria'], presence: 'Authorized Partner' },
  { code: 'CI', iso3: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮', dialCode: '+225', region: 'west', aliases: ['ivory coast', 'cote d\'ivoire'], presence: 'Dealer Network' },
  { code: 'BF', iso3: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', region: 'west', aliases: ['burkina'], presence: 'Dealer Network' },
  { code: 'BJ', iso3: 'BEN', name: 'Benin', flag: '🇧🇯', dialCode: '+229', region: 'west', aliases: ['benin'], presence: 'Dealer Network' },
  { code: 'NE', iso3: 'NER', name: 'Niger', flag: '🇳🇪', dialCode: '+227', region: 'west', aliases: ['niger'], presence: 'Dealer Network' },
  { code: 'GN', iso3: 'GIN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224', region: 'west', aliases: ['guinea'], presence: 'Dealer Network' },
  { code: 'CM', iso3: 'CMR', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237', region: 'central', aliases: ['cameroon'], presence: 'Authorized Support' },
  { code: 'LR', iso3: 'LBR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231', region: 'west', aliases: ['liberia'], presence: 'Dealer Network' },
  { code: 'SL', iso3: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', region: 'west', aliases: ['sierra leone'], presence: 'Dealer Network' },
  { code: 'GM', iso3: 'GMB', name: 'Gambia', flag: '🇬🇲', dialCode: '+220', region: 'west', aliases: ['gambia'], presence: 'Dealer Network' },
  { code: 'OTHER', iso3: 'OTH', name: 'Other / International', flag: '🌐', dialCode: '+1', aliases: ['international'], presence: 'International Office' },
];

export const COUNTRIES = COUNTRY_LIST;

export const getCountryByCode = (code: string): CountryInfo => {
  return COUNTRY_LIST.find((c) => c.code.toLowerCase() === code.toLowerCase() || c.iso3?.toLowerCase() === code.toLowerCase()) || COUNTRY_LIST[0];
};

export const getCountryByIso3 = (code: string): CountryInfo => {
  return getCountryByCode(code);
};

export const getCountryByName = (name: string): CountryInfo => {
  return COUNTRY_LIST.find((c) => c.name.toLowerCase() === name.toLowerCase()) || COUNTRY_LIST[0];
};
