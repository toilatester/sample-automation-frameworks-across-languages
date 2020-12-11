const log4js = require('log4js');
const {
  JasmineAgent,
  JasmineAgentReportPortalListener,
  Log4jsReportPortalAppender
} = require('../helper/report-portal');

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../spec-1.js', '../spec-2.js'],
  onPrepare: () => {
    jasmine.getEnv().addReporter(JasmineAgentReportPortalListener);
  },
  beforeLaunch: () => {
    log4js.configure({
      appenders: {
        rp: {
          type: Log4jsReportPortalAppender,
          layout: {
            type: 'basic'
          }
        },
        out: {
          type: 'stdout',
          layout: {
            type: 'basic'
          }
        },
        multi: {
          type: 'multiFile',
          base: 'logs/',
          property: 'categoryName',
          extension: '.log',
          layout: {
            type: 'basic'
          }
        }
      },
      categories: {
        default: {
          appenders: ['multi', 'out', 'rp'],
          level: 'all'
        }
      }
    });
  },
  afterLaunch: () => {
    return JasmineAgent.getExitPromise().then(() => {
      console.log('finish work');
    })
  }
};