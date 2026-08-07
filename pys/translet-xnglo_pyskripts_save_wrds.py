import os
import pandas as pd

# Define data with updated column names
data = { "e52": ["Apple"], "e23": ["apple"], "x38": ["xxpxl"], "xv38": ["seb"], "vinqi": ["सेब"] }

# Convert to DataFrame
df = pd.DataFrame(data)

# Ensure the parent directory exists and save CSV
csv_path = os.path.join("..", "wrds.csv")
df.to_csv(csv_path, index=False, encoding="utf-8")
print(f"wrds.csv file has been created successfully at {csv_path}!")
