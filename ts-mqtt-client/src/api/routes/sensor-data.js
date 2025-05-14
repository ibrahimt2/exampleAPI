const Router = require('hermesjs/lib/router');
const {
  validateMessage
} = require('../../lib/message-validator');
const router = new Router();
const sensorDataHandler = require('../handlers/sensor-data');
module.exports = router;

router.use('sensor/data', async (message, next) => {
  try {
    await validateMessage(message.payload, 'sensor/data', 'TemperatureReading', 'publish');
    await sensorDataHandler._publish({
      message
    });
    next();
  } catch (e) {
    next(e);
  }
});