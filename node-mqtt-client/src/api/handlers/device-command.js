const handler = module.exports = {};

const subscribeMiddlewares = [];

/**
 * Registers a middleware function for the subscribe operation to be executed during request processing.
 *
 * Middleware functions have access to options object that you can use to access the message content and other helper functions
 *
 * @param {function} middlewareFn - The middleware function to be registered.
 * @throws {TypeError} If middlewareFn is not a function.
 */
handler.registerSubscribeMiddleware = (middlewareFn) => {
  if (typeof middlewareFn !== 'function') {
    throw new TypeError('middlewareFn must be a function');
  }
  subscribeMiddlewares.push(middlewareFn);
}

/**
   * 
   *
   * @param {object} options
   * @param {object} options.message
  
  *
   * @param {string} options.message.headers.command
 * @param {string} options.message.headers.reason
  */
handler._subscribe = async ({
  message
}) => {
  for (const middleware of subscribeMiddlewares) {
    await middleware(message);
  }
};