const log4js = require('log4js');
const path = require('path');
const { RunnerHelper } = require('../../helper/runner.helper');

const maxByteFileSize = 104857600;
const maxFileBackup = 3;
const log4jsConfigureWithReportPortal = (logPath, log4jsReportPortalAppender) => {
  return log4js.configure({
    appenders: {
      rp: {
        type: log4jsReportPortalAppender,
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
        base: `${logPath}`,
        property: 'categoryName',
        extension: '.log',
        layout: {
          type: 'basic'
        },
        maxLogSize: maxByteFileSize,
        backups: maxFileBackup,
        compress: true
      }
    },
    categories: {
      default: {
        appenders: ['multi'],
        level: 'all'
      }
    }
  });
};

const log4jsDefaultConfigure = (logPath) => {
  return log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'basic'
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
        maxLogSize: maxByteFileSize,
        backups: maxFileBackup,
        compress: true
      }
    },
    categories: {
      default: {
        appenders: ['multi'],
        level: 'all'
      }
    }
  });
};
const Log4jsConfig = (logFolderPath, log4jsReportPortalAppender) => {
  const appRootPath = RunnerHelper.appRootPath || 'logs';
  const logPath = !logFolderPath ? path.join(appRootPath, 'logs') : logFolderPath;
  log4jsReportPortalAppender
    ? log4jsConfigureWithReportPortal(logPath, log4jsReportPortalAppender)
    : log4jsDefaultConfigure(logPath);
  return log4js;
};
exports.Log4jsConfig = Log4jsConfig;
