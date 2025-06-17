#!/bin/bash

# Simple script to run a Mosquitto MQTT broker locally for integration testing
docker run -d --rm \
  --name test-mosquitto \
  -p 1884:1883 \
  eclipse-mosquitto

echo "🚀 Mosquitto broker running on mqtt://localhost:1884"
