import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals'
import net from 'net'
import mqtt from 'mqtt'
import Aedes from 'aedes'

jest.setTimeout(15000)

let pubClient: mqtt.MqttClient
let broker: Aedes
let server: net.Server

const PORT = 1884

beforeAll(async () => {
  broker = new Aedes()
  server = net.createServer(broker.handle)
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
})

afterAll(async () => {
  await Promise.all([
    new Promise<void>((resolve, reject) =>
      pubClient?.end(false, {}, (err) => (err ? reject(err) : resolve()))
    ),
    new Promise<void>((resolve) => server.close(() => resolve())),
    new Promise<void>((resolve) => broker.close(() => resolve())),
  ])
})

const initClient = async () => {
  const { client } = require('../../node_mqtt_client/src/api')
  await client.init()
  return client
}

const shutdownClient = async (client: any) => {
  await client.app.adapters[0].instance.client.end(true)
}

describe('sensor-data MQTT integration', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should call registered middleware when a message is published', async () => {
    const client = await initClient()
    const handler = require('../../node_mqtt_client/src/api/handlers/sensor-data')

    const topic = 'sensor/data'
    const testPayload = {
      deviceId: 'abc123',
      temperature: 42.1,
      timestamp: new Date().toISOString(),
    }

    const middlewareSpy = jest.fn()
    handler.registerPublishMiddleware(middlewareSpy)

    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`, { reconnectPeriod: 0 })
    await new Promise((res) => pubClient.on('connect', res))
    pubClient.publish(topic, JSON.stringify(testPayload))

    await new Promise((res) => setTimeout(res, 500))

    expect(middlewareSpy).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining(testPayload) })
    )
    expect(middlewareSpy).toHaveBeenCalledTimes(1)
    await shutdownClient(client)
  })

  it('should not call middleware for an invalid message', async () => {
    const client = await initClient()
    const handler = require('../../node_mqtt_client/src/api/handlers/sensor-data')

    const topic = 'sensor/data'
    const invalidPayload = { deviceId: 'abc123' } // missing fields

    const middlewareSpy = jest.fn()
    handler.registerPublishMiddleware(middlewareSpy)

    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`, { reconnectPeriod: 0 })
    await new Promise((res) => pubClient.on('connect', res))
    pubClient.publish(topic, JSON.stringify(invalidPayload))

    await new Promise((res) => setTimeout(res, 500))

    expect(middlewareSpy).not.toHaveBeenCalled()
    await shutdownClient(client)
  })

  it('should handle malformed JSON payloads without crashing', async () => {
    const client = await initClient()
    const handler = require('../../node_mqtt_client/src/api/handlers/sensor-data')

    const topic = 'sensor/data'

    const middlewareSpy = jest.fn()
    handler.registerPublishMiddleware(middlewareSpy)

    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`, { reconnectPeriod: 0 })
    await new Promise((res) => pubClient.on('connect', res))
    pubClient.publish(topic, '{"deviceId": "abc123",') // malformed JSON

    await new Promise((res) => setTimeout(res, 500))

    expect(middlewareSpy).not.toHaveBeenCalled()
    await shutdownClient(client)
  })
  it('should call all registered middleware functions when a message is published', async () => {
    const client = await initClient()
    const handler = require('../../node_mqtt_client/src/api/handlers/sensor-data')

    const topic = 'sensor/data'
    const testPayload = {
      deviceId: 'abc123',
      temperature: 42.1,
      timestamp: new Date().toISOString(),
    }

    const middlewareSpy1 = jest.fn()
    const middlewareSpy2 = jest.fn()
    const middlewareSpy3 = jest.fn()

    handler.registerPublishMiddleware(middlewareSpy1)
    handler.registerPublishMiddleware(middlewareSpy2)
    handler.registerPublishMiddleware(middlewareSpy3)

    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`, { reconnectPeriod: 0 })
    await new Promise((res) => pubClient.on('connect', res))
    pubClient.publish(topic, JSON.stringify(testPayload))

    await new Promise((res) => setTimeout(res, 500))

    for (const spy of [middlewareSpy1, middlewareSpy2, middlewareSpy3]) {
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ payload: expect.objectContaining(testPayload) })
      )
      expect(spy).toHaveBeenCalledTimes(1)
    }

    await shutdownClient(client)
  })
})