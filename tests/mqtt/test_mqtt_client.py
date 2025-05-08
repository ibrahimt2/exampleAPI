import pytest
from unittest.mock import MagicMock, patch
from payload import Payload
from messaging import Messaging
import main
import logging

# ---------- Payload Tests ----------

def test_payload_serializes_correctly():
    payload = Payload(deviceId="sensor-123", temperature=22.5, timestamp="2023-09-25T12:34:56Z")
    json_str = payload.to_json()
    assert eval(json_str) == {
        "deviceId": "sensor-123",
        "temperature": 22.5,
        "timestamp": "2023-09-25T12:34:56Z"
    }

def test_payload_deserializes_correctly():
    json_str = '{"deviceId": "sensor-123", "temperature": 22.5, "timestamp": "2023-09-25T12:34:56Z"}'
    payload = Payload.from_json(json_str)
    assert payload.deviceId == "sensor-123"
    assert payload.temperature == 22.5
    assert payload.timestamp == "2023-09-25T12:34:56Z"

# ---------- Messaging Tests ----------

@patch('messaging.mqtt.Client')
def test_messaging_initializes_and_connects(mock_mqtt_client):
    config = {'host': 'test.mqtt.com', 'port': '1883', 'username': 'u', 'password': 'p'}
    client_instance = MagicMock()
    mock_mqtt_client.return_value = client_instance

    Messaging(config)

    client_instance.username_pw_set.assert_called_with('u', 'p')
    client_instance.connect.assert_called_with('test.mqtt.com', 1883)

@patch('messaging.mqtt.Client')
def test_publish_calls_client_publish(mock_mqtt_client):
    client_instance = MagicMock()
    mock_mqtt_client.return_value = client_instance

    messenger = Messaging({'host': 'localhost'}, clientId='test')
    messenger.publish('test/topic', 'data', qos=1, retain=True)

    client_instance.publish.assert_called_with('test/topic', 'data', 1, True)

# ---------- Handler Tests ----------
def test_sensor_data_handler_logs_and_parses(caplog):
    payload = Payload(deviceId="abc", temperature=99.9, timestamp="2024-01-01T00:00:00Z")
    msg = MagicMock()
    msg.payload.decode.return_value = payload.to_json()

    caplog.set_level(logging.INFO)

    main.sensorData(client=None, userdata=None, msg=msg)

    assert "Received json:" in caplog.text
    assert "Received message:" in caplog.text