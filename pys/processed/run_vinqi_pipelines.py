import csv
import os

def xnglo_pipeline(word):
    # Normalize input to lowercase for consistency
    word = word.lower()

    # 1. Article Removal
    if word == "the":
        return ""

    # 2. Number & Homophone Overrides (T & W Focus)
    word = word.replace('three', 'Jri')
    word = word.replace('four', 'foxr')
    word = word.replace('for', 'for')
    word = word.replace('five', 'faiw')
    word = word.replace('seven', 'sewxn')
    word = word.replace('eight', 'et')
    word = word.replace('ate', 'ext')

    # 2a. To / Too / Two
    word = word.replace('two', 'tuu')
    word = word.replace('too', 'tux')
    word = word.replace('to', 'tu')

    # 2b. Sea / See
    word = word.replace('sea', 'six')
    word = word.replace('see', 'sii')

    # 2c. One
    word = word.replace('one', 'wn')

    # 3. Structural W Rules & Question Word Overrides
    word = word.replace('where', 'wevr')
    word = word.replace('when', 'wvn')
    word = word.replace('why', 'wave')
    word = word.replace('wave', 'wew')
    word = word.replace('wr', 'r')       # Silent w
    word = word.replace('wh', 'w')       # Simplify wh- digraphs

    # 4. Structural T Clusters, Suffixes & Special Plurals
    word = word.replace('tch', 'c')      
    word = word.replace('tion', 'sxn')   
    word = word.replace('tial', 'sxl')   
    word = word.replace('tious', 'sxs')
    word = word.replace('thieves', 'Jiiws')
    word = word.replace('instance', 'instxns')

    # 5. TH-Pronouns & Determiners (Q-Mapping)
    word = word.replace('there', 'qexr')
    word = word.replace('this', 'qis')
    word = word.replace('that', 'qxt')
    word = word.replace('those', 'qoz')
    word = word.replace('they', 'qey')
    word = word.replace('day', 'dey')
    word = word.replace('them', 'qxm')

    # 6. OUGH & Complex Refinements (J for TH)
    word = word.replace('rough', 'rf')
    word = word.replace('tough', 'tf')
    word = word.replace('enough', 'inxf')
    word = word.replace('thought', 'Jot')     
    word = word.replace('through', 'Jru')     
    word = word.replace('though', 'Jf')       
    word = word.replace('bough', 'baa')       

    # 7. Weight / Wet / Vet / Vowel-X Transitions
    word = word.replace('weight', 'wext')
    word = word.replace('wet', 'wxt')
    word = word.replace('vet', 'wxxt')

    # 8. H Rules & Font-Specific Vocal Shifts
    word = word.replace('hour', 'vaoxr')
    word = word.replace('honour', 'vonxr')
    word = word.replace('ph', 'f')       

    # 9. X Refinements & Prefixes
    word = word.replace('exam', 'eksam')
    word = word.replace('exact', 'eksxkt')
    word = word.replace('exist', 'eksist')
    word = word.replace('final', 'fainxl')

    return word

def convert_e52_to_e23(word: str) -> str:
    if not word:
        return ""
    w = str(word).lower().strip()
    if w == "never":
        return "nxwxr"
    w = w.replace('j', 'z')
    w = w.replace('q', 'k')
    w = w.replace('v', 'w')
    return w

def convert_e23_to_x38(word: str) -> str:
    if not word:
        return ""
    r = str(word).lower().strip()
    r = r.replace('ck', 'k')
    r = r.replace('ew', 'iyu')
    r = r.replace('er', 'xr')
    return r

# Maximum comprehensive list of words combining all pipeline tests and extra vocabulary rows
words_to_process = [
    "two", "too", "to", "one", "three", "four", "for", "five", 
    "seven", "sea", "see", "eight", "ate", "where", "when", "why", 
    "wave", "hour", "honour", "exam", "exact", "exist", "final",
    "thieves", "there", "this", "that", "those", "they", "day", "them",
    "instance", "rough", "tough", "enough", "thought", "through", 
    "though", "bough", "weight", "wet", "vet", "never", "new", "few",
    "view", "brew", "sew", "skew", "chew", "stew", "grew", "blew", "flew",
    "whatever", "whenever", "wherever", "whichever", "whoever", "uneven"
]

csv_filename = 'wrds.csv'

# Write comprehensive multi-column file with maximum rows and fields:
# Fields: original_word, xnglo_word, e52, e23, x38, status
with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['original_word', 'xnglo_word', 'e52', 'e23', 'x38', 'status'])
    
    for w in sorted(list(set(words_to_process))):
        xnglo_val = xnglo_pipeline(w)
        e52_val = w.upper()
        e23_val = convert_e52_to_e23(w)
        x38_val = convert_e23_to_x38(e23_val)
        status = "Processed_OK"
        writer.writerow([w, xnglo_val, e52_val, e23_val, x38_val, status])

print(f"'{csv_filename}' successfully generated with maximum rows and columns!")
