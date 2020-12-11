const PuppeteerConfig = require('./puppeteer').config;
const RestConfig = require('./rest').config;
const WebDriverConfig = require('./webdriver').config;
const { ObjectUtils } = require('../../core/utils');

const ENGINE_CONFIG = {
  PUPPETEER: { NAME: 'Puppeteer', CONFIG: PuppeteerConfig },
  WEB_DRIVER: { NAME: 'WebDriver', CONFIG: WebDriverConfig },
  REST: { NAME: 'REST', CONFIG: RestConfig }
};
ObjectUtils.freezeObject(ENGINE_CONFIG);
exports.ENGINE_CONFIG = ENGINE_CONFIG;
