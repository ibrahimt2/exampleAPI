
    const schema = {
  "asyncapi": "2.6.0",
  "info": {
    "title": "Example MQTT API",
    "version": "1.0.8",
    "description": "Basic AsyncAPI spec for MQTT pub/sub"
  },
  "servers": {
    "production": {
      "url": "mqtt://localhost:1884",
      "protocol": "mqtt"
    }
  },
  "channels": {
    "sensor/data": {
      "description": "Publishes temperature data from a device",
      "publish": {
        "message": {
          "name": "TemperatureReading",
          "payload": {
            "type": "object",
            "properties": {
              "deviceId": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-2>"
              },
              "temperature": {
                "type": "number",
                "format": "float",
                "x-parser-schema-id": "<anonymous-schema-3>"
              },
              "timestamp": {
                "type": "string",
                "format": "date-time",
                "x-parser-schema-id": "<anonymous-schema-4>"
              }
            },
            "required": [
              "deviceId",
              "temperature",
              "timestamp"
            ],
            "x-parser-schema-id": "<anonymous-schema-1>"
          }
        }
      }
    },
    "device/command": {
      "description": "Receives command to control the device",
      "subscribe": {
        "message": {
          "name": "ControlCommand",
          "payload": {
            "type": "object",
            "properties": {
              "command": {
                "type": "string",
                "enum": [
                  "on",
                  "off",
                  "restart"
                ],
                "x-parser-schema-id": "<anonymous-schema-6>"
              },
              "reason": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-7>"
              }
            },
            "required": [
              "command"
            ],
            "x-parser-schema-id": "<anonymous-schema-5>"
          }
        }
      }
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  