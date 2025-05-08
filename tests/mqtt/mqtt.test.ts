import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import mqtt from 'mqtt';

jest.mock('mqtt');

describe('device-command subscription handler', () => {
  let deviceCommandHandler: any;

  beforeEach(() => {
    jest.resetModules();
    deviceCommandHandler = require('../../ts-mqtt-client/src/api/handlers/device-command');
  });

  // One function is waiting for messages; this test checks if it actually gets called when a message comes in.
  it('should call registered middleware with incoming message', async () => {
    const mockMiddleware = jest.fn();
    deviceCommandHandler.registerSubscribeMiddleware(mockMiddleware);

    const msg = { headers: { command: 'restart', reason: 'maintenance' } };

    await deviceCommandHandler._subscribe({ message: msg });

    expect(mockMiddleware).toHaveBeenCalledWith(msg);
    expect(mockMiddleware).toHaveBeenCalledTimes(1);
  });

  // Make sure people can’t register nonsense instead of a proper function
  it('should throw if non-function middleware is registered', () => {
    expect(() => deviceCommandHandler.registerSubscribeMiddleware('notAFunction')).toThrow(TypeError);
  });

  // No middlewares? No problem. We just want the app not to crash
  it('should work with no subscribe middleware registered', async () => {
    await expect(
      deviceCommandHandler._subscribe({ message: { headers: { command: 'on' } } })
    ).resolves.not.toThrow();
  });

  // We added two things that should react to a message; they should go off in order
  it('should call multiple subscribe middlewares in order', async () => {
    const callOrder: string[] = [];
    deviceCommandHandler.registerSubscribeMiddleware(() => callOrder.push('first'));
    deviceCommandHandler.registerSubscribeMiddleware(() => callOrder.push('second'));

    await deviceCommandHandler._subscribe({ message: { headers: { command: 'off' } } });

    expect(callOrder).toEqual(['first', 'second']);
  });

  // If one middleware breaks, the error should still be raised
  it('should propagate error from subscribe middleware', async () => {
    deviceCommandHandler.registerSubscribeMiddleware(() => {
      throw new Error('middleware failed');
    });

    await expect(
      deviceCommandHandler._subscribe({ message: { headers: { command: 'off' } } })
    ).rejects.toThrow('middleware failed');
  });

  // Empty message? Don't blow up.
  it('should handle empty message gracefully', async () => {
    await expect(deviceCommandHandler._subscribe({ message: {} })).resolves.not.toThrow();
  });

  // Try subscribing to two separate messages one after the other, both should be handled cleanly
  it('should handle multiple subscriptions without mixing state', async () => {
    const mockMiddleware = jest.fn();
    deviceCommandHandler.registerSubscribeMiddleware(mockMiddleware);

    const msg1 = { headers: { command: 'on', reason: 'init' } };
    const msg2 = { headers: { command: 'restart', reason: 'user' } };

    await deviceCommandHandler._subscribe({ message: msg1 });
    await deviceCommandHandler._subscribe({ message: msg2 });

    expect(mockMiddleware).toHaveBeenCalledTimes(2);
    expect(mockMiddleware).toHaveBeenNthCalledWith(1, msg1);
    expect(mockMiddleware).toHaveBeenNthCalledWith(2, msg2);
  });

  // Simulate what the MQTT system would do: receive a buffer and convert it to JSON
  it('should simulate MQTT message decode and trigger subscribe handler', async () => {
    const { client } = require('../../ts-mqtt-client/src/api');
    const testMiddleware = jest.fn();
    client.registerSubscribeMiddleware(testMiddleware);

    const testPayload = {
      headers: {
        command: 'restart',
        reason: 'simulated',
      },
    };

    const buffer = Buffer.from(JSON.stringify(testPayload));

    // Simulate the adapter turning raw buffer into object and calling the handler
    const handler = require('../../ts-mqtt-client/src/api/handlers/device-command');
    await handler._subscribe({ message: JSON.parse(buffer.toString()) });

    expect(testMiddleware).toHaveBeenCalledWith(testPayload);
  });
});