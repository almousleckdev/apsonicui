export interface CoverageCountry {
  name: string;
  active: boolean;
}

export interface Office {
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}

export const coverageCountries: CoverageCountry[] = [
  { name: "Mali ML 🇲🇱", active: true },
  { name: "Togo TG 🇹🇬", active: true },
  { name: "Ghana GH 🇬🇭", active: true },
  { name: "Burkina Faso BF 🇧🇫", active: true },
  { name: "Ivory Coast CI 🇨🇮", active: true },
  { name: "Benin BJ 🇧🇯", active: true },
  { name: "Guinea GN 🇬🇳", active: true },
  { name: "Niger NE 🇳🇪", active: true },
  { name: "Senegal SN 🇸🇳", active: true },
  { name: "Nigeria NG 🇳🇬", active: true },
  { name: "Cameroon CM 🇨🇲", active: true },
  { name: "Chad TD 🇹🇩", active: true },
  { name: "Liberia LR 🇱🇷", active: true },
  { name: "Sierra Leone SL 🇸🇱", active: true },
  { name: "Gambia GM 🇬🇲", active: true },
  { name: "Gabon GA 🇬🇦", active: true },
  { name: "Kenya KE 🇰🇪", active: true },
  { name: "Uganda UG 🇺🇬", active: true },
  { name: "Tanzania TZ 🇹🇿", active: true },
  { name: "Mauritania MR 🇲🇷", active: true },
  { name: "Angola AO 🇦🇴", active: true },
  { name: "Namibia NA 🇳🇦", active: true },
  { name: "Zambia ZM 🇿🇲", active: true },
  { name: "Mozambique MZ 🇲🇿", active: true },
  { name: "Rwanda RW 🇷🇼", active: true },
  { name: "Burundi BI 🇧🇮", active: true },
  { name: "Ethiopia ET 🇪🇹", active: true },
];

export const offices: Office[] = [
  {
    country: "Togo TG 🇹🇬",
    city: "Lomé",
    address: "Zone Portuaire, Lomé",
    phone: "+228 90 00 00 00",
    email: "togo@apsonic.dev",
    mapUrl:
      "https://maps.google.com/maps?q=Lome%20Port%2C%20Togo&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    country: "Ghana GH 🇬🇭",
    city: "Accra",
    address: "124 Spintex Road, Accra",
    phone: "+233 54 000 0000",
    email: "ghana@apsonic.dev",
    mapUrl:
      "https://maps.google.com/maps?q=124%20Spintex%20Road%2C%20Accra%2C%20Ghana&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    country: "Mali ML 🇲🇱",
    city: "Bamako",
    address: "ACI 2000, Bamako",
    phone: "+223 20 00 00 00",
    email: "mali@apsonic.dev",
    mapUrl:
      "https://maps.google.com/maps?q=ACI%202000%2C%20Bamako%2C%20Mali&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    country: "Burkina Faso BF 🇧🇫",
    city: "Ouagadougou",
    address: "Kwame N'Krumah Ave, Ouagadougou",
    phone: "+226 25 00 00 00",
    email: "burkina@apsonic.dev",
    mapUrl: "",
  },
  {
    country: "Ivory Coast CI 🇨🇮",
    city: "Abidjan",
    address: "Marcory Zone 4, Abidjan",
    phone: "+225 27 00 00 00",
    email: "ci@apsonic.dev",
    mapUrl: "",
  },
  {
    country: "Benin BJ 🇧🇯",
    city: "Cotonou",
    address: "Ave Steinmetz, Cotonou",
    phone: "+229 97 00 00 00",
    email: "benin@apsonic.dev",
    mapUrl: "",
  },
  {
    country: "Guinea GN 🇬🇳",
    city: "Conakry",
    address: "Kaloum, Conakry",
    phone: "+224 620 00 00 00",
    email: "guinea@apsonic.dev",
    mapUrl: "",
  },
  {
    country: "China CN 🇨🇳",
    city: "Guangzhou",
    address: "Tianhe District, Guangzhou",
    phone: "+86 20 0000 0000",
    email: "hq@apsonic.dev",
    mapUrl: "",
  },
];
