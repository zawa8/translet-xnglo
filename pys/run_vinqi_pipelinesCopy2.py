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

    # 5. TH-Pronouns & Determiners (Q-Mapping)
    word = word.replace('there', 'qexr')
    word = word.replace('this', 'qis')
    word = word.replace('that', 'qxt')
    word = word.replace('those', 'qoz')
    word = word.replace('they', 'qey')
    word = word.replace('day', 'dey')
    word = word.replace('them', 'qxm')

    # 6. H Rules & Font-Specific Vocal Shifts
    word = word.replace('hour', 'vaoxr')
    word = word.replace('honour', 'vonxr')
    word = word.replace('ph', 'f')       

    # 7. X Refinements & Prefixes
    word = word.replace('exam', 'eksam')
    word = word.replace('exact', 'eksxkt')
    word = word.replace('exist', 'eksist')
    word = word.replace('final', 'fainxl')

    return word

# Test words including the new entries
words_to_process = [
    "two", "too", "to", "one", "three", "four", "for", "five", 
    "seven", "sea", "see", "eight", "ate", "where", "when", "why", 
    "wave", "hour", "honour", "exam", "exact", "exist", "final",
    "thieves", "there", "this", "that", "those", "they", "day", "them"
]

csv_filename = 'wrds.csv'

# File write / update
with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['original_word', 'xnglo_word'])
    
    for w in words_to_process:
        converted = xnglo_pipeline(w)
        writer.writerow([w, converted])

print(f"'{csv_filename}' successfully updated with all new q-mapping rules and tests!")