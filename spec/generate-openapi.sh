#!/bin/bash
set -e

echo "Generating OpenAPI v2..."

protoc \
  -I. \
  -I./grpc-gateway \
  -I./grpc-gateway/protoc-gen-openapiv2/options \
  -I./googleapis \
  --openapiv2_out . \
  server.proto

echo "Converting to OpenAPI v3..."
npx swagger2openapi server.swagger.json -o server.yaml

echo "✅ Done."