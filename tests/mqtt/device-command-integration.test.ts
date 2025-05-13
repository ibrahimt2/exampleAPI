import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals'
import mqtt from 'mqtt'
import net from 'net'
import Aedes from 'aedes'

jest.setTimeout(15000)

let deviceCommandHandler: any

const PORT = 1884
let broker: Aedes
let server: net.Server
let subClient: mqtt.MqttClient
let pubClient: mqtt.MqttClient

beforeAll(async () => {
  broker = new Aedes()
  server = net.createServer(broker.handle)
  await new Promise<void>((resolve) => server.listen(PORT, () => resolve()))
})

afterAll(async () => {
  await Promise.all([
    new Promise<void>((resolve, reject) =>
      subClient?.end(false, {}, (err) => (err ? reject(err) : resolve()))
    ),
    new Promise<void>((resolve, reject) =>
      pubClient?.end(false, {}, (err) => (err ? reject(err) : resolve()))
    ),
    new Promise<void>((resolve) => server.close(() => resolve())),
    new Promise<void>((resolve) => broker.close(() => resolve())),
  ])
})

describe('device-command MQTT integration', () => {
  beforeEach(() => {
    jest.resetModules()
    deviceCommandHandler = require('../../ts-mqtt-client/src/api/handlers/device-command')
  })

  it('should invoke handler and validate message via real broker', async () => {
    const topic = 'device/command'
    const testPayload = {
      command: 'restart',
      reason: 'integration',
    }

    const { validateMessage } = require('../../ts-mqtt-client/src/lib/message-validator')
    const validationSpy = jest.spyOn(require('../../ts-mqtt-client/src/lib/message-validator'), 'validateMessage')

    // Register validation middleware
    deviceCommandHandler.registerSubscribeMiddleware(async (msg: any) => {
      await validateMessage(msg, topic, 'ControlCommand', 'subscribe')
    })

    // Setup subscriber
    subClient = mqtt.connect(`mqtt://localhost:${PORT}`)
    await new Promise<void>((resolve) => subClient.on('connect', () => resolve()))
    await new Promise<void>((resolve, reject) => {
      subClient.subscribe(topic, (err) => (err ? reject(err) : resolve()))
    })

    subClient.on('message', async (_, buffer) => {
      const message = JSON.parse(buffer.toString())
      await deviceCommandHandler._subscribe({ message })
    })

    // Setup publisher
    pubClient = mqtt.connect(`mqtt://localhost:${PORT}`)
    await new Promise<void>((resolve) => pubClient.on('connect', () => resolve()))

    pubClient.publish(topic, JSON.stringify(testPayload))

    // Wait for processing
    await new Promise((res) => setTimeout(res, 1000))

    expect(validationSpy).toHaveBeenCalledWith(testPayload, topic, 'ControlCommand', 'subscribe')
  })
})