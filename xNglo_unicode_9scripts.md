# xNglo Unicode 9 Scripts Mapping

## Overview

This file documents the mapping between **Unicode code points** of 9 Indian
writing scripts and their **xNglo phonetic representations**. The mapping is
used by `hsciistr_file.ts` in the `uL2xin38()` method for script conversion.

## Unicode Script Blocks

| # | Script | Block Start | Block End | Unicode Range |
|---|--------|-------------|-----------|---------------|
| 1 | Hindi (Devanagari) | 0x0900 | 0x097F | U+0900–U+097F |
| 2 | Bengali | 0x0980 | 0x09FF | U+0980–U+09FF |
| 3 | Gurmukhi (Punjabi) | 0x0A00 | 0x0A7F | U+0A00–U+0A7F |
| 4 | Gujarati | 0x0A80 | 0x0AFF | U+0A80–U+0AFF |
| 5 | Oriya | 0x0B00 | 0x0B7F | U+0B00–U+0B7F |
| 6 | Tamil | 0x0B80 | 0x0BFF | U+0B80–U+0BFF |
| 7 | Telugu | 0x0C00 | 0x0C7F | U+0C00–U+0C7F |
| 8 | Kannada | 0x0C80 | 0x0CFF | U+0C80–U+0CFF |
| 9 | Malayalam | 0x0D00 | 0x0D7F | U+0D00–U+0D7F |

## Block Structure

Each script block is **128 code points** (0x00–0x7F). The offset within the
block determines the character type:

| Offset Range | Type |
|--------------|------|
| 0x00–0x04 | Reserved / Special |
| 0x05–0x14 | Vowels (16) |
| 0x15–0x39 | Consonants (37) |
| 0x3A–0x3D | Special signs |
| 0x3E–0x4C | Vowel signs / Matras (15) |
| 0x4D | Virama (Halant) |
| 0x4E–0x5F | Additional / Nukta variants |
| 0x60–0x63 | Additional vowels |
| 0x64–0x65 | Punctuation |
| 0x66–0x6F | Digits (0-9) |
| 0x70–0x7F | Script-specific |

## xNglo Mapping Table

### Vowels (Offsets 0x05–0x14)

| Offset | Unicode | xNglo | Type |
|--------|---------|-------|------|
| 0x05 | अ | x | standalone vowel (schwa) |
| 0x06 | आ | a | vowel |
| 0x07 | इ | _i | vowel |
| 0x08 | ई | _i | vowel (long) |
| 0x09 | उ | _u | vowel |
| 0x0A | ऊ | _u | vowel (long) |
| 0x0B | ऋ | ri | vocalic r |
| 0x0C | ऌ | li | vocalic l |
| 0x0F | ए | _e | vowel |
| 0x10 | ऐ | _e | vowel |
| 0x13 | ओ | o | vowel |
| 0x14 | औ | ou | vowel |

### Consonants (Offsets 0x15–0x39)

| Offset | Unicode | xNglo | Type |
|--------|---------|-------|------|
| 0x15 | क | k | unaspirated |
| 0x16 | ख | K | aspirated |
| 0x17 | ग | g | unaspirated |
| 0x18 | घ | gh | aspirated |
| 0x19 | ङ | N | nasal |
| 0x1A | च | c | unaspirated |
| 0x1B | छ | C | aspirated |
| 0x1C | ज | z | unaspirated |
| 0x1D | झ | Z | aspirated |
| 0x1E | ञ | n | nasal |
| 0x1F | ट | t | retroflex |
| 0x20 | ठ | T | aspirated retroflex |
| 0x21 | ड | d | retroflex |
| 0x22 | ढ | D | aspirated retroflex |
| 0x23 | ण | n | retroflex nasal |
| 0x24 | त | j | dental |
| 0x25 | थ | J | aspirated dental |
| 0x26 | द | q | dental |
| 0x27 | ध | Q | aspirated dental |
| 0x28 | न | n | dental nasal |
| 0x2A | प | p | unaspirated |
| 0x2B | फ | f | aspirated |
| 0x2C | ब | b | unaspirated |
| 0x2D | भ | B | aspirated |
| 0x2E | म | m | nasal |
| 0x2F | य | y | semi-vowel |
| 0x30 | र | r | liquid |
| 0x32 | ल | l | liquid |
| 0x33 | ळ | l | retroflex liquid |
| 0x35 | व | w | semi-vowel |
| 0x36 | श | S | sibilant |
| 0x37 | ष | s | retroflex sibilant |
| 0x38 | स | s | dental sibilant |
| 0x39 | ह | v | glottal |

### Matras / Vowel Signs (Offsets 0x3E–0x4C)

| Offset | Unicode | xNglo | Meaning |
|--------|---------|-------|---------|
| 0x3E | ा | a | aa matra |
| 0x3F | ि | i | i matra |
| 0x40 | ी | i | ii matra |
| 0x41 | ु | u | u matra |
| 0x42 | ू | u | uu matra |
| 0x43 | ृ | ri | vocalic r matra |
| 0x47 | े | e | e matra |
| 0x48 | ै | ye | ai matra |
| 0x49 | ॉ | o | o matra |
| 0x4B | ो | o | oo matra |
| 0x4C | ौ | ou | au matra |
| 0x4D | ् | (empty) | virama / halant |

### Digits (Offsets 0x66–0x6F)

| Offset | Unicode | xNglo |
|--------|---------|-------|
| 0x66 | ० | 0 |
| 0x67 | १ | 1 |
| 0x68 | २ | 2 |
| 0x69 | ३ | 3 |
| 0x6A | ४ | 4 |
| 0x6B | ५ | 5 |
| 0x6C | ६ | 6 |
| 0x6D | ७ | 7 |
| 0x6E | ८ | 8 |
| 0x6F | ९ | 9 |

## Conversion Logic (uL2xin38)

Input: Unicode text (any of 9 Indian scripts)
↓
For each character:

Get Unicode code point

Determine block: li = (codepoint / 0x80) >> 0

Determine offset: ki = codepoint % 0x80

If li in range (0x12-0x1A): lookup in 9-scripts table

If li == 0x1B: lookup in 10th script (Sinhala) table

Else: keep character as-is
↓
Post-processing (unicode_india_10scripts_to_xnglo_india_post)
↓
Output: xNglo text


## Key Features

1. **Unified mapping** – All 9 scripts map to same xNglo representation
2. **Offset-based** – Same offset = same phonetic value across scripts
3. **Simple lookup** – Array indexing by offset (0x00-0x7F)
4. **Post-processing** – Handles special cases (schwa deletion, nasal rules)

## Usage

```typescript
const converter = new hsciistr();
converter.set_input("नमस्ते");
await converter.duztr();
console.log(converter.output['xi38']);  // xNglo output
```

## References
TypeScript source: <https://github.com/zawa8/htrlib/blob/main/src/hsciistr_file.ts>

CSV data: <https://github.com/zawa8/xnglo/blob/main/dxta/xNglo_phoneme_grapheme.csv>

Unicode charts: <https://unicode.org/charts/>
