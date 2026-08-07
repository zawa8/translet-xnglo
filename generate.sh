#!/bin/bash

# Generate Data Files Script
# This script runs all data file generators

echo "🔄 Starting data file generation..."
echo ""

echo "1️⃣  Generating phonetic matrix..."
npm run compile-matrix
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate phonetic matrix"
  exit 1
fi
echo "✅ Phonetic matrix generated"
echo ""

echo "2️⃣  Generating English-Hindi word mapping..."
npm run compile-words
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate English-Hindi mapping"
  exit 1
fi
echo "✅ English-Hindi mapping generated"
echo ""

echo "3️⃣  Generating Hindi-Vinqi common words..."
npm run compile-hindi-words
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate Hindi-Vinqi words"
  exit 1
fi
echo "✅ Hindi-Vinqi words generated"
echo ""

echo "🎉 All data files generated successfully!"
echo ""
echo "Generated files:"
echo "  - lib/compiledPhonetics.ts"
echo "  - lib/englishToHindiData.ts"
echo "  - lib/hindiCommonWords.ts"
