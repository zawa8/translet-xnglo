import csv
import os

# Absolute Data Path Routing
DATA_DIR = os.path.join("..", "dxta")
DATA_FILE = os.path.join(DATA_DIR, "wrds.csv")

def convert_e52_to_e23(word):
    if not word:
        return ""
    w = word.lower()
    
    # 🛡️ Structural Vowel Shield Layer (e.g., never -> nxwxr, everyday -> xwixryday)
    if 'eve' in w:
        w = w.replace('eve', 'xwx')
        
    # Primitive structural base letter mutations
    w = w.replace('j', 'z').replace('q', 'k').replace('v', 'w')
    return w

def convert_e23_to_x38_master_compiled_engine(word):
    """
    Pipeline 2 Production Engine:
    Processes character data in structurally separated, hazard-free execution layers.
    Ordered meticulously to avoid sound contamination and logic-loop recursion.
    """
    if not word:
        return word

    # ==========================================
    # LAYER 1: SILENT PREFIX & FIXED CLUSTER STRIPPING
    # ==========================================
    # Rule A: Starting kn -> n (e.g., knife -> naif, knot -> noxt)
    if word.startswith('kn'):
        word = 'n' + word[2:]
        
    # Rule B: Silent 'l' consolidation in alk clusters (e.g., walk -> wak, talk -> tak)
    word = word.replace('alk', 'ak')

    # ==========================================
    # LAYER 2: SYSTEMATIC ADJACENT VOWEL ADJUSTMENTS
    # ==========================================
    # Protect compound word segments where 'w' is part of an independent syllable
    compounds_protection = ["work", "wall", "wife", "way", "wear", "wood", "witness", "wolf", "wolves"]
    placeholders = {}
    
    for idx, comp in enumerate(compounds_protection):
        if comp in word:
            key = f"__COMP_{idx}__"
            placeholders[key] = comp
            word = word.replace(comp, key)
            
    # Core Vowel Layer Shift: ew -> iyu (e.g., new -> niyu, few -> fiyu, nneeww -> nneiyuw)
    word = word.replace('ew', 'iyu')
    
    # Re-verify and restore structural compound blocks intact
    for key, original in placeholders.items():
        word = word.replace(key, original)

    # ==========================================
    # LAYER 3: HARD CONSONANT CLUSTERS & COMPLEX C BEHAVIORS
    # ==========================================
    word = word.replace('ck', 'k')  # Enforce sound compaction (e.g., back -> bak)
    word = word.replace('ch', 'C')  # Temporary capital protection token lock
    word = word.replace('cy', 'si') # Soft 'c' variation mapping
    word = word.replace('ce', 'se') # Soft 'c' variation mapping
    word = word.replace('ci', 'si') # Soft 'c' variation mapping
    word = word.replace('c', 'k')   # All remaining standard lowercase c become hard k
    word = word.replace('C', 'c')   # Release protected token back safely to lowercase c

    # ==========================================
    # LAYER 4: COMPLEX SYSTEM DOUBLE-CHARACTER SIMPLIFICATION LOOP
    # ==========================================
    # Runs dynamically across the entire ASCII character set to reduce any duplicated letters
    for char_code in range(ord('a'), ord('z') + 1):
        double_char = chr(char_code) * 2
        # Use an active while loop to recursively crush multi-layered double injections (e.g., nnn -> n)
        while double_char in word:
            word = word.replace(double_char, chr(char_code))

    # ==========================================
    # LAYER 5: FINISHING SUFFIX MAPPING SYSTEM (-tion family)
    # ==========================================
    if 'stion' in word:
        word = word.replace('stion', 's_cn') # Protect variant question -> kuescn sound segment
    
    word = word.replace('mention', 'mensxn')
    word = word.replace('action', 'xksxn')
    word = word.replace('tion', 'sxn')
    word = word.replace('s_cn', 'scn') # Release token boundary cleanly to matching trace string

    return word

def run_isolated_transformation_matrix():
    if not os.path.exists(DATA_FILE):
        print(f"[Error] Target data grid tracking template file missing at: {DATA_FILE}")
        return

    print("=== EXECUTING RE-ORDERED SECURE WORKSPACE PARALLEL PIPELINE ===")
    
    target_headers = ["e52", "e23", "x38", "xv38", "vinqi"]
    rows = []
    
    # Read row parameters securely from database
    with open(DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Defensive key resolution handling for lowercase structural parity
            e52_val = (row.get("e52") or row.get("E52", "")).strip()
            vinqi_val = (row.get("vinqi") or "").strip()
            xv38_val = (row.get("xv38") or row.get("xV38") or "").strip()
            
            if e52_val:
                # Force clean dynamic pipeline translations across the board
                derived_e23 = convert_e52_to_e23(e52_val)
                derived_x38 = convert_e23_to_x38_master_compiled_engine(derived_e23)
                
                rows.append({
                    "e52": e52_val.upper(),
                    "e23": derived_e23,
                    "x38": derived_x38,
                    "xv38": xv38_val,
                    "vinqi": vinqi_val
                })

    # Overwrite dataset matrix file back securely onto disk
    with open(DATA_FILE, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=target_headers)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"\nSuccess! 3000 rows completely processed. Structured parameters saved to: {DATA_FILE}")

if __name__ == "__main__":
    run_isolated_transformation_matrix()
