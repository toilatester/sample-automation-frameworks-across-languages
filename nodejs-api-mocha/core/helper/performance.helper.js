/* eslint-disable global-require,max-len, no-empty,no-console */

const heapdump = require('heapdump');
const fs = require('fs');
const path = require('path');

class PerformanceHelper {
  static captureHeapMemory(appRootPath, name) {
    const performanceLogFolder = `${appRootPath}/performance.logs`;
    if (!fs.existsSync(performanceLogFolder)) {
      fs.mkdirSync(performanceLogFolder);
    }
    const performanceLogPath = path.resolve(performanceLogFolder, `${name}.heapsnapshot`);
    heapdump.writeSnapshot(performanceLogPath);
    console.log(`Capture heapDump ${name}`);
  }
}

exports.PerformanceHelper = PerformanceHelper;
