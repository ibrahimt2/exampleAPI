#!/bin/bash

# Usage: ./generate_python_client.sh openapi.yaml python-client

set -e

INPUT_PATH="$1"
TARGET_DIR="$2"

if [ -z "$INPUT_PATH" ] || [ -z "$TARGET_DIR" ]; then
  echo "Usage: $0 path/to/openapi.yaml target/output/folder"
  exit 1
fi

# Generate the client
python3 -m openapi_python_client generate --path "$INPUT_PATH"

# Extract the title from the spec (use yq if available, fallback to grep)
if command -v yq &> /dev/null; then
  TITLE=$(yq '.info.title' "$INPUT_PATH" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-*$//')
else
  TITLE=$(grep -i 'title:' "$INPUT_PATH" | head -n1 | cut -d ':' -f2 | xargs | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-*$//')
fi

DEFAULT_FOLDER="${TITLE}-client"

# Find inner *_client/ folder before moving
INNER_PKG_FOLDER=$(find "${DEFAULT_FOLDER}" -maxdepth 1 -type d -name '*_client' -print -quit)
INNER_PKG_NAME=$(basename "$INNER_PKG_FOLDER")

# Ensure target directory exists
mkdir -p "$TARGET_DIR"

# Move top-level files (README.md, pyproject.toml, etc.)
shopt -s dotglob
rsync -a "${DEFAULT_FOLDER}/" "$TARGET_DIR/"

# Flatten the inner *_client folder by merging it into target and deleting it
if [ -n "$INNER_PKG_NAME" ]; then
  rsync -a "${TARGET_DIR}/${INNER_PKG_NAME}/" "$TARGET_DIR/"
  rm -rf "${TARGET_DIR:?}/${INNER_PKG_NAME}"
fi

# Clean up the original generated folder
rm -rf "${DEFAULT_FOLDER}"

echo "✅ Client flattened and overwritten into: $TARGET_DIR"