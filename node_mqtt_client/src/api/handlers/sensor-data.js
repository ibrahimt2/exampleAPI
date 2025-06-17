const handler = module.exports = {};

const publishMiddlewares = [];

/**
 * Registers a middleware function for the publish operation to be executed during request processing.
 *
 * Middleware functions have access to options object that you can use to access the message content and other helper functions
 *
 * @param {function} middlewareFn - The middleware function to be registered.
 * @throws {TypeError} If middlewareFn is not a function.
 */
handler.registerPublishMiddleware = (middlewareFn) => {
  if (typeof middlewareFn !== 'function') {
    throw new TypeError('middlewareFn must be a function');
  }
  publishMiddlewares.push(middlewareFn);
}

/**
   * 
   *
   * @param {object} options
   * @param {object} options.message
  
  *
   * @param {string} options.message.headers.deviceId
 * @param {number} options.message.headers.temperature
 * @param {string} options.message.headers.timestamp
  */
handler._publish = async ({
  message
}) => {
  for (const middleware of publishMiddlewares) {
    await middleware(message);
  }
};