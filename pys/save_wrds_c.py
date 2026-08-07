import csv
import os
import subprocess
# Run 'pip install deep-translator' in terminal if you haven't already
from deep_translator import GoogleTranslator 

# Paths setup targeting the separate file
data_path = os.path.join("..", "dxta", "wrds_c.csv")
ts_script_path = os.path.join("..", "transliterate.ts")
temp_ts_runner = "temp_runner.ts"

# Combined Master List (142 words + CHILD)
words_e52 = [
    "ACCOUNTANCY", "ACCURACY", "ADEQUACY", "ADVOCACY", "AGENCY", "ARISTOCRACY", 
    "BANKRUPTCY", "BICYCLE", "BICYCLES", "BICYCLING", "BICYCLISTS", "BOUNCY", 
    "BUREAUCRACY", "CANDIDACY", "CLANCY", "COMPETENCY", "COMPLACENCY", "CONFEDERACY", 
    "CONSERVANCY", "CONSISTENCY", "CONSPIRACY", "CONSTITUENCY", "CONSULTANCY", 
    "CONTINGENCY", "CRYPTOCURRENCY", "CURRENCY", "CYANIDE", "CYBER", "CYBERBULLYING", 
    "CYBERCRIME", "CYBERSECURITY", "CYBERSPACE", "CYBORG", "CYCLE", "CYCLED", 
    "CYCLES", "CYCLICAL", "CYCLING", "CYCLIST", "CYCLISTS", "CYCLONE", "CYCLONES", 
    "CYLINDER", "CYLINDERS", "CYLINDRICAL", "CYNICAL", "CYNICISM", "CYNTHIA", 
    "CYPRESS", "CYPRIOT", "CYPRUS", "CYRIL", "CYRUS", "CYSTIC", "CYSTS", "DARCY", 
    "DECENCY", "DEFICIENCY", "DELICACY", "DELINQUENCY", "DEMOCRACY", "DEPENDENCY", 
    "DIPLOMACY", "DISCREPANCY", "DOXYCYCLINE", "EFFICACY", "EFFICIENCY", "EMERGENCY", 
    "ENCYCLOPEDIA", "EXCELLENCY", "EXPECTANCY", "FALLACY", "FANCY", "FLUENCY", 
    "FREQUENCY", "IDIOCY", "ILLITERACY", "IMMEDIACY", "IMMUNODEFICIENCY", "INADEQUACY", 
    "INCONSISTENCY", "INEFFICIENCY", "INFANCY", "INSOLVENCY", "INSUFFICIENCY", 
    "INSURGENCY", "INTIMACY", "JUICY", "LATENCY", "LEGACY", "LEGITIMACY", "LIFECYCLE", 
    "LITERACY", "LUCY", "LUNACY", "MACY", "MERCY", "MOTORCYCLE", "MOTORCYCLES", 
    "MOTORCYCLISTS", "NANCY", "NORMALCY", "NUMERACY", "OCCUPANCY", "PERCY", "PHARMACY", 
    "PIRACY", "POLICY", "POLICYHOLDER", "POLICYHOLDERS", "POLICYMAKERS", "POTENCY", 
    "PREGNANCY", "PRESIDENCY", "PRIVACY", "PROFICIENCY", "PROPHECY", "QUINCY", 
    "RECYCLABLE", "RECYCLABLES", "RECYCLE", "RECYCLED", "RECYCLING", "REDUNDANCY", 
    "REGENCY", "RELEVANCY", "RESIDENCY", "RESILIENCY", "SECRECY", "SOLVENCY", 
    "SPICY", "STACY", "SUFFICIENCY", "SUPREMACY", "SURROGACY", "TENANCY", "TENDENCY", 
    "TRACY", "TRANSPARENCY", "URGENCY", "VACANCY", "VIBRANCY",
    "CHILD"
]

def convert_e52_to_e23(word):
    w = word.lower()
    w = w.replace('j', 'z')
    w = w.replace('q', 'k')
    w = w.replace('v', 'w')
    return w

def convert_e23_to_x38_c_advanced(word):
    if not word:
        return word
    
    # Step 1: ch -> Capital 'C' (Temporary protection)
    word = word.replace('ch', 'C')
    
    # Step 2: Soft C phonetic conversions (Only affects lowercase 'c')
    word = word.replace('cy', 'si')
    word = word.replace('ce', 'se')
    word = word.replace('ci', 'si')
    
    # Step 3: Hard C phonetic conversions (All remaining lowercase 'c' become 'k')
    word = word.replace('c', 'k')
    
    # Step 4: Convert protected Capital 'C' back to lowercase 'c'
    word = word.replace('C', 'c')
    
    return word

def get_xV38_from_ts(hindi_text):
    if not hindi_text:
        return ""
    abs_ts_path = os.path.abspath(ts_script_path).replace(os.sep, '/')
    ts_code = f"""
import {{ hindiToXngloVinqi }} from '{abs_ts_path.replace('.ts', '')}';
try {{
    console.log(hindiToXngloVinqi("{hindi_text}"));
}} catch (err: any) {{
    console.error("TS_ERROR:", err.message);
}}
"""
    with open(temp_ts_runner, "w", encoding="utf-8") as temp_file:
        temp_file.write(ts_code)
        
    try:
        result = subprocess.run(
            ["ts-node", "--compiler-options", '{"module": "commonjs"}', temp_ts_runner],
            shell=True,
            capture_output=True,
            text=True,
            encoding="utf-8"
        )
        if os.path.exists(temp_ts_runner):
            os.remove(temp_ts_runner)
        return result.stdout.strip()
    except Exception:
        if os.path.exists(temp_ts_runner):
            os.remove(temp_ts_runner)
        return ""

print("Connecting to translation API...")
translator = GoogleTranslator(source='en', target='hi')

headers = ["E52", "e23", "x38", "xV38", "vinqi"]
os.makedirs(os.path.dirname(data_path), exist_ok=True)

print("Processing Isolated C-Group Database (Rules: ch->C->c, cy->si, ce->se, ci->si, c->k)...")

with open(data_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    
    for count, e52 in enumerate(words_e52, 1):
        e23_val = convert_e52_to_e23(e52)
        x38_val = convert_e23_to_x38_c_advanced(e23_val)
        
        # Pull Hindi translation from internet for vinqi column
        try:
            vinqi_val = translator.translate(e52)
        except Exception:
            vinqi_val = ""
            
        # Call transliterate.ts script for xV38 column
        xv38_val = get_xV38_from_ts(vinqi_val)
        
        writer.writerow([e52, e23_val, x38_val, xv38_val, vinqi_val])
        
        if count % 20 == 0 or count == len(words_e52):
            print(f"Processed {count}/{len(words_e52)} tokens inside database...")

print(f"\nSuccess! Completely populated isolation database saved at: {data_path}")
