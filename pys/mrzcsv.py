import csv
import glob
import os

FOLDER_PATH = r"C:\wimxlprogs\xnglop\translet-xnglo\dxta\koliplot"
OUTPUT_FILE = os.path.join(FOLDER_PATH, "merged.csv")


def merge_csv_files(folder_path, output_file):
    output_name = os.path.basename(output_file).lower()
    csv_files = sorted(
        path for path in glob.glob(os.path.join(folder_path, "*.csv"))
        if os.path.isfile(path) and os.path.basename(path).lower() != output_name
    )

    if not csv_files:
        print("No CSV files found to merge.")
        return

    seen_keys = set()
    merged_rows = []
    header = None
    duplicates_removed = 0

    for file_path in csv_files:
        filename = os.path.basename(file_path)
        with open(file_path, newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            file_header = next(reader, None)
            if file_header is None:
                continue

            if header is None:
                header = file_header
            elif file_header != header:
                print(f"Warning: header mismatch in {filename}, using first file header.")

            for row in reader:
                if not row:
                    continue

                key = row[0].strip()
                if not key:
                    continue

                if key in seen_keys:
                    duplicates_removed += 1
                    continue

                seen_keys.add(key)
                merged_rows.append(row)

    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(merged_rows)

    print(f"Merged {len(csv_files)} files into {output_file}")
    print(f"Removed {duplicates_removed} duplicate entries.")
    print(f"Wrote {len(merged_rows)} unique rows.")


if __name__ == "__main__":
    merge_csv_files(FOLDER_PATH, OUTPUT_FILE)
