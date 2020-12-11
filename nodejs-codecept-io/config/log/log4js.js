const log4js = require('log4js');

exports.Log4JSConfig = (logPath, isEnableConsoleLog) => {
  log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'coloured'
        }
      },
      multi: {
        type: 'multiFile',
        base: `${logPath}`,
        property: 'categoryName',
        extension: '.log',
        layout: {
          type: 'basic'
        },
        maxLogSize: 2000000,
        backups: 1,
        compress: true
      }
    },
    categories: {
      default: {
        appenders: isEnableConsoleLog ? ['multi', 'out'] : ['multi'],
        level: 'all'
      }
    }
  });
};
