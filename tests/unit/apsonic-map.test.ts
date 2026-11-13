import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { FeatureCollection } from 'geojson';
import { APSONIC_COUNTRIES, findApsonicCountry, isApsonicIso3 } from '@/lib/data/apsonic-countries';
import { findFeatureContaining, getMainlandBounds } from '@/lib/utils/map-geometry';
import { processCountryFeatures } from '@/lib/utils/geojson';

const world = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../public/data/africa-countries.json'), 'utf8'),
) as FeatureCollection;
const countries = { ...world, features: processCountryFeatures(world.features) };
const byIso = (iso: string) => countries.features.find((f) => f.properties?.isoCode === iso)!;

describe('finding an APSONIC country from what was typed', () => {
  it('matches full names in English, French and Chinese, ignoring case and accents', () => {
    expect(findApsonicCountry('Gabon')?.iso3).toBe('GAB');
    expect(findApsonicCountry('  GABON ')?.iso3).toBe('GAB');
    expect(findApsonicCountry("Côte d'Ivoire")?.iso3).toBe('CIV');
    expect(findApsonicCountry("cote d’ivoire")?.iso3).toBe('CIV');
    expect(findApsonicCountry('bénin')?.iso3).toBe('BEN');
    expect(findApsonicCountry('加蓬')?.iso3).toBe('GAB');
    expect(findApsonicCountry('刚果金')?.iso3).toBe('COD');
  });

  it('finds a country from a partial name only when it is unambiguous', () => {
    expect(findApsonicCountry('gab')?.iso3).toBe('GAB');
    expect(findApsonicCountry('tanz')?.iso3).toBe('TZA');
    expect(findApsonicCountry('ga')).toBeNull(); // too short
    expect(findApsonicCountry('gu')).toBeNull();
    expect(findApsonicCountry('ni')).toBeNull(); // Niger or Nigeria
    expect(findApsonicCountry('nige')).toBeNull(); // still both
    expect(findApsonicCountry('niger')?.iso3).toBe('NER'); // an exact name wins over "Nigeria"
    expect(findApsonicCountry('nigeri')?.iso3).toBe('NGA');
  });

  it('does not match countries APSONIC is not in, or nonsense', () => {
    expect(findApsonicCountry('Egypt')).toBeNull();
    expect(findApsonicCountry('Atlantis')).toBeNull();
    expect(findApsonicCountry('')).toBeNull();
  });

  it('every listed country has a shape on the map, so none is silently left grey', () => {
    for (const country of APSONIC_COUNTRIES) {
      expect(byIso(country.iso3), country.name).toBeDefined();
    }
  });
});

describe('country shapes', () => {
  it('marks exactly the APSONIC countries', () => {
    const green = countries.features.filter((f) => f.properties?.apsonic === true).map((f) => f.properties?.isoCode);
    expect(green.sort()).toEqual(APSONIC_COUNTRIES.map((c) => c.iso3).sort());
    expect(byIso('EGY').properties?.apsonic).toBe(false);
    expect(isApsonicIso3('GAB')).toBe(true);
  });

  it('keeps every African country on the map, not only the APSONIC ones', () => {
    expect(countries.features.length).toBeGreaterThanOrEqual(48);
  });

  it('uses the same English names as the stores for APSONIC countries', () => {
    expect(byIso('CIV').properties?.name).toBe('Ivory Coast');
    expect(byIso('TZA').properties?.name).toBe('Tanzania');
  });
});

describe('finding the country a visitor is standing in', () => {
  const countryAt = (lat: number, lng: number) => findFeatureContaining(countries, lng, lat)?.properties?.isoCode;

  it('finds the country from coordinates', () => {
    expect(countryAt(5.6037, -0.187)).toBe('GHA'); // Accra
    expect(countryAt(0.3901, 9.4544)).toBe('GAB'); // Libreville
    expect(countryAt(12.6392, -8.0029)).toBe('MLI'); // Bamako
  });

  it('knows Lesotho is not South Africa, although it sits inside it', () => {
    expect(countryAt(-29.31, 27.48)).toBe('LSO'); // Maseru
    expect(countryAt(-26.2, 28.04)).toBe('ZAF'); // Johannesburg
  });

  it('returns nothing for the open sea', () => {
    expect(countryAt(0, -20)).toBeUndefined();
  });
});

describe('framing a country', () => {
  it('frames the mainland of Tanzania, not the sea out to its islands', () => {
    const [[west], [east]] = getMainlandBounds(byIso('TZA'))!;
    expect(west).toBeGreaterThan(28);
    expect(east).toBeLessThan(41); // Mafia/Pemba reach further east than the mainland coast
  });
});
