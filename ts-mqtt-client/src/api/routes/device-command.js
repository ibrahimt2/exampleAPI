const Router = require('hermesjs/lib/router');
const {
  validateMessage
} = require('../../lib/message-validator');
const router = new Router();
const deviceCommandHandler = require('../handlers/device-command');
module.exports = router;

router.useOutbound('device/command', async (message, next) => {
  try {
    await validateMessage(message.payload, 'device/command', 'ControlCommand', 'subscribe');
    await deviceCommandHandler._subscribe({
      message
    });
    next();
  } catch (e) {
    next(e);
  }
});