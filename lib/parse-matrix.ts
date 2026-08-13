import fs from 'fs';
import path from 'path';

export function compilePhoneticMap() {
  // 1. Resolve path to your specific csv file name
  const csvPath = path.join(process.cwd(), 'dxta', 'fonetiks.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: File not found at ${csvPath}`);
    console.error(`Please check if your file inside the dxta folder is named "fonetiks.csv"`);
    return;
  }

  console.log(`Reading mapping entries from: ${csvPath}...`);
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  // 2. Safely handle Windows (\r\n) and Unix (\n) line endings
  const lines = fileContent
    .split(/\r?\n/)
    .map(line => line.split(','))
    .filter(row => row.length > 1 && row[0] !== '');

  if (lines.length === 0) {
    console.error("❌ Error: The CSV file seems to be empty or unparseable.");
    return;
  }

  // Extract our matrix headers: [, x, a, i, u, e, o] -> slice first empty element
  const headers = lines[0].slice(1).map(h => h.trim()); 
  const mappingObject: Record<string, string> = {};

  // Loop through rows (the consonant bases)
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const baseConsonant = row[0].trim(); // e.g., 'k'
    
    // Map cell items to their corresponding vowel headers
    row.slice(1).forEach((cell, index) => {
      const targetedValue = cell.trim();
      const headerVowel = headers[index];
      
      if (targetedValue && headerVowel) {
        // Creates phonetic pairs: { "ka": "ka", "ki": "ki" } 
        mappingObject[`${baseConsonant}${headerVowel}`] = targetedValue;
      }
    });
  }

  // 3. Make sure the output destination target folder exists
  const outputFolder = path.join(process.cwd(), 'lib');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const outputPath = path.join(outputFolder, 'compiledPhonetics.ts');
  
  fs.writeFileSync(
    outputPath, 
    `export const phoneticMatrix = ${JSON.stringify(mappingObject, null, 2)};\n`, 
    'utf-8'
  );
  
  console.log(`\n✅ Success! File generated at: ${outputPath}`);
  console.log(`Generated matrix contains ${Object.keys(mappingObject).length} rule pairs.`);
}

// Automatically execute the function when running the script directly via tsx
compilePhoneticMap();
