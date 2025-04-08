#!/bin/bash

# Output file
OUTPUT_FILE="all-templates.ejs"
> "$OUTPUT_FILE"  # Clear the file if it exists

# Loop over all .ejs files, EXCLUDING the output file
for file in *.ejs; do
  if [ "$file" != "$OUTPUT_FILE" ]; then
    echo "========================================" >> "$OUTPUT_FILE"
    echo "// File: $file" >> "$OUTPUT_FILE"
    echo "========================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
  fi
done

echo "✅ Combined all templates into $OUTPUT_FILE"