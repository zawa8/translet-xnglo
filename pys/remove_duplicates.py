import csv
import os

# 1. Paste the full folder path where your CSV is located
# Note: Use 'r' before the string to handle Windows backslashes properly
csv_folder = r"C:\wimxlprogs\xnglop\translet-xnglo\dxta\fromnet"

# 2. Define the input and output file paths
input_file = os.path.join(csv_folder, "ehd_yunik.csv")
output_file = os.path.join(csv_folder, "ehd_yunik2.csv")

seen_fields = set()

# Verify the file actually exists before running
if not os.path.exists(input_file):
    print(f"error: the file could not be found at:\n{input_file}")
    print("please check your folder path and file name.")
else:
    with open(input_file, mode="r", newline="", encoding="utf-8") as infile, \
         open(output_file, mode="w", newline="", encoding="utf-8") as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        for row in reader:
            if not row:
                continue
                
            first_field = row[0]
            
            if first_field not in seen_fields:
                writer.writerow(row)
                seen_fields.add(first_field)

    print(f"success! cleaned file saved to:\n{output_file}")
