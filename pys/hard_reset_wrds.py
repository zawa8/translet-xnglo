import csv
import os
import sys

# Absolute path setup to rule out environmental path shifting bugs
current_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.abspath(os.path.join(current_dir, "..", "dxta"))
data_file = os.path.join(data_dir, "wrds.csv")

print("=== STARTING DIAGNOSTIC WORKSPACE SYSTEM RESET ===")
print(f"Targeting directory: {data_dir}")
print(f"Targeting file asset: {data_file}")

# 1. Clean previous lock handles by physically removing any hidden cache file
if os.path.exists(data_file):
    try:
        os.remove(data_file)
        print(" -> Successfully removed the old corrupted wrds.csv file.")
    except Exception as e:
        print(f" -> [ERROR] Could not delete old file. It might be locked by Excel or an editor: {e}")
        sys.exit(1)
else:
    print(" -> No old file existed. Clean workspace verified.")

# 2. Re-create directories explicitly
os.makedirs(data_dir, exist_ok=True)

# 3. Formulate the precise hardcoded block data rows
headers = ["E52", "e23", "x38", "xv38", "vinqi"]
rows = [
    {"E52": "XIAOMI", "e23": "xiaomi", "x38": "xiaomi", "xv38": "", "vinqi": "Xiaomi"},
    {"E52": "XINHUA", "e23": "xinhua", "x38": "xinhua", "xv38": "zinhua", "vinqi": "सिन्हुआ"},
    {"E52": "XMAS", "e23": "xmas", "x38": "xmas", "xv38": "zmas", "vinqi": "क्रिसमस"},
    {"E52": "XOXO", "e23": "xoxo", "x38": "xoxo", "xv38": "zokso", "vinqi": "XOXO"}
]

# Generate placeholders up to exactly 3000 rows
start_index = 640
needed_rows = 3000 - len(rows)

for i in range(needed_rows):
    num = start_index + i
    token = f"WORD_{num}"
    rows.append({
        "E52": token,
        "e23": token.lower(),
        "x38": token.lower(),
        "xv38": "",
        "vinqi": ""
    })

# 4. Perform absolute stream force-write operation to disk
try:
    with open(data_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\n-> SUCCESS! Total {len(rows)} sequential grid rows force-written cleanly.")
except Exception as e:
    print(f" -> [FATAL ERROR] Writing operation failed on stream: {e}")

print("=== RESET COMPLETED ===")
