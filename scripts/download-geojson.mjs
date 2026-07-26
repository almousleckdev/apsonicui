import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of ISO3 codes we want to include (from countries.ts)
const AFRICAN_ISO_CODES = [
  'GHA', 'TGO', 'BEN', 'MLI', 'GIN', 'BFA', 'CIV', 'SEN', 'NGA', 'GMB', 'GNB', 'SLE', 'LBR', 'NER', 'MRT', 'CPV',
  'TZA', 'KEN', 'UGA', 'ETH', 'SOM', 'ERI', 'DJI', 'RWA', 'BDI', 'SSD',
  'CMR', 'CAF', 'COG', 'COD', 'TCD', 'GNQ', 'GAB', 'STP', 'AGO',
  'ZMB', 'MWI', 'MOZ', 'ZWE', 'BWA', 'NAM', 'ZAF', 'LSO', 'SWZ', 'MDG', 'MUS',
  'EGY', 'TUN'
];

async function main() {
  console.log("Fetching World GeoJSON...");
  const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON from ${url}: ${response.statusText}`);
  }
  const worldGeoJson = await response.json();
  
  console.log("Filtering African countries...");
  const africanFeatures = worldGeoJson.features.filter(feature => {
    const props = feature.properties || {};
    const isoCode = (props['ISO3166-1-Alpha-3'] || props.ISO_A3 || props.ISO_A3_EH || props.ISO3 || props.iso_a3 || props.ADM0_A3 || props.ISO || '').toUpperCase();
    return AFRICAN_ISO_CODES.includes(isoCode);
  });
  
  console.log(`Filtered down to ${africanFeatures.length} African countries.`);
  
  const outputDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'africa-countries.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    type: 'FeatureCollection',
    features: africanFeatures
  }, null, 2));
  
  console.log(`Successfully wrote filtered GeoJSON to ${outputPath}`);
}

main().catch(err => {
  console.error("Error generating GeoJSON:", err);
  process.exit(1);
});
