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
    new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    ),
  ])
  broker.close()
})

describe('sensor-data MQTT integration', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should call registered middleware when a message is published', async () => {
    const topic = 'sensor/data'
    const testPayload = {
      deviceId: 'abc123',
      temperature: 42.1,
      timestamp: new Date().toISOString(),
    }

    const { client } = require('../../ts-mqtt-client/src/api')
    const handler = require('../../ts-mqtt-client/src/api/handlers/sensor-data')

    const middlewareSpy = jest.fn()
    handler.registerPublishMiddleware(middlewareSpy)

    await client.init()

    // Connect pubClient
    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`)
    await new Promise<void>((resolve) => pubClient.on('connect', () => resolve()))

    // Publish actual MQTT message to trigger the Hermes listener
    pubClient.publish(topic, JSON.stringify(testPayload))

    await new Promise((res) => setTimeout(res, 500))

    expect(middlewareSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining(testPayload)
      })
    )    
    expect(middlewareSpy).toHaveBeenCalledTimes(1)
  })
})