const path = require('path');

class FileUtils {
  static createTestScriptLogFileName(testScriptFilePath) {
    return path.basename(testScriptFilePath, path.extname(testScriptFilePath));
  }
}

exports.FileUtils = FileUtils;
