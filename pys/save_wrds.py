import csv
import os
import subprocess

# Paths setup
data_path = os.path.join("..", "dxta", "wrds.csv")
ts_script_path = os.path.join("..", "transliterate.ts")
temp_ts_runner = "temp_runner.ts"

def convert_e52_to_e23(word):
    w = word.lower()
    w = w.replace('j', 'z')
    w = w.replace('q', 'k')
    w = w.replace('v', 'w')
    return w

def convert_e23_to_x38_for_x(word):
    """
    Algorithm for words containing 'x'
    Rule 1: Starts with 'x' -> 'z'
    Rule 2: Middle or End 'x' -> 'ks'
    """
    if not word or 'x' not in word:
        return word  # Skip if 'x' is not present for this iteration

    # Rule 1: Check if the word starts with 'x'
    if word.startswith('x'):
        # Replace only the first character, and then replace any middle/end 'x' with 'ks'
        modified_word = 'z' + word[1:].replace('x', 'ks')
    else:
        # Rule 2: Middle or end 'x' becomes 'ks'
        modified_word = word.replace('x', 'ks')
        
    return modified_word

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

print("Processing database: Generating e23 -> x38 (for 'x' rule) and syncing xV38...")

headers = ["e52", "e23", "x38", "xV38", "vinqi"]
rows = []

if os.path.exists(data_path):
    with open(data_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for count, row in enumerate(reader, 1):
            e52 = row["e52"]
            e23_val = convert_e52_to_e23(e52)
            vinqi_val = row["vinqi"]
            
            # Step 1: Run our new algorithm for column x38
            x38_val = convert_e23_to_x38_for_x(e23_val)
            
            # Step 2: Ensure xV38 is mapped via transliterate.ts if not already filled
            xv38_val = row.get("xV38", "")
            if not xv38_val or xv38_val == "":
                xv38_val = get_xV38_from_ts(vinqi_val)
            
            rows.append([e52, e23_val, x38_val, xv38_val, vinqi_val])
            
            if count % 50 == 0:
                print(f"Processed {count} words...")

# Overwrite updates back to your CSV
with open(data_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print(f"\nPhase 1 Complete! 'x' rules applied inside x38 column at: {data_path}")
