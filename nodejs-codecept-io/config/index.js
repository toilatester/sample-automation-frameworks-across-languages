const runnerConfig = require('./engine');
const logConfig = require('./log');
const pluginConfig = require('./plugins');
const reportConfig = require('./report');

module.exports = {
  ...runnerConfig,
  ...logConfig,
  ...pluginConfig,
  ...reportConfig
};
