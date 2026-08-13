import csv
import os

DATA_FILE = os.path.join("..", "dxta", "wrds.csv")

# Known prefix map for reference
X38_PREFIX_MAP = {"un": "xn", "re": "ri", "in": "in", "dis": "dis"}
TRUE_EW_ROOTS = ("new", "few", "view", "brew", "sew", "skew", "chew", "stew", "grew", "blew", "flew")

def audit_csv():
    if not os.path.exists(DATA_FILE):
        print(f"File not found at: {DATA_FILE}")
        return

    with open(DATA_FILE, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Loaded {len(rows)} rows for auditing...\n")

    anomalies = []

    for idx, row in enumerate(rows, 1):
        e52 = row.get("e52") or row.get("E52") or ""
        e23 = row.get("e23") or ""
        x38 = row.get("x38") or ""

        # Check 1: 'ever' family mismatch (should have 'xwxr' instead of 'iyuxr')
        if "ever" in e52.lower() and "ever" not in e52.lower()[:3]: # Exclude base 'ever'
            if "iyuxr" in x38 and not any(root in e52.lower() for root in TRUE_EW_ROOTS):
                anomalies.append((idx, e52, e23, x38, "Unexpected 'iyuxr' in -ever compound"))

        # Check 2: 'un-' prefix missed in x38
        if e52.lower().startswith("un") and not x38.startswith("xn"):
            anomalies.append((idx, e52, e23, x38, "'un-' prefix should transform to 'xn-' in x38"))

        # Check 3: 'v' remaining in e23
        if "v" in e23:
            anomalies.append((idx, e52, e23, x38, "Unconverted 'v' found in e23"))

    if not anomalies:
        print("🎉 SUCCESS: No systematic phonetic anomalies found across the dataset!")
    else:
        print(f"⚠️ Found {len(anomalies)} potential issue(s):\n")
        for idx, e52, e23, x38, reason in anomalies[:20]: # show first 20
            print(f"Row {idx:4d} | {e52:15s} -> e23: {e23:15s} -> x38: {x38:15s} | Reason: {reason}")

if __name__ == "__main__":
    audit_csv()