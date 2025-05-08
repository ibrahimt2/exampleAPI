const Hermes = require('hermesjs');
const app = new Hermes();
const path = require('path');
const {
  yellow,
  gray,
  cyan
} = require('chalk');
const buffer2string = require('./middlewares/buffer2string');
const string2json = require('./middlewares/string2json');
const json2string = require('./middlewares/json2string');
const logger = require('./middlewares/logger');
const errorLogger = require('./middlewares/error-logger');
const config = require('../lib/config');
const serverConfig = config.broker.mqtt;
const MqttAdapter = require('hermesjs-mqtt');

const sensorData = require('./routes/sensor-data.js');
const deviceCommand = require('./routes/device-command.js');

app.addAdapter(MqttAdapter, serverConfig);

app.use(buffer2string);
app.use(string2json);
app.use(logger);

// Channels

console.log(cyan.bold.inverse(' SUB '), gray('Subscribed to'), yellow('sensor/data'));
app.use(sensorData);
console.log(yellow.bold.inverse(' PUB '), gray('Will eventually publish to'), yellow('device/command'));
app.useOutbound(deviceCommand);

app.use(errorLogger);
app.useOutbound(errorLogger);
app.useOutbound(logger);
app.useOutbound(json2string);

function init() {
  app
    .listen()
    .then((adapters) => {
      console.log(cyan.underline(`${config.app.name} ${config.app.version}`), gray('is ready!'), '\n');
      adapters.forEach(adapter => {
        console.log('🔗 ', adapter.name(), gray('is connected!'));
      });
    })
    .catch(console.error);
}

const handlers = {
  registerPublishMiddleware: require('./handlers/sensor-data').registerPublishMiddleware,
  registerSubscribeMiddleware: require('./handlers/device-command').registerSubscribeMiddleware
}

const client = {
  app,
  init,
  ...handlers
};

module.exports = {
  client
};