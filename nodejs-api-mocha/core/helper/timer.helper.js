let lastUpdateTokenTimestampInSecond = Date.now() / 1000;

class TimerHelper {
  static get updateTokenTimestampInSecond() {
    return lastUpdateTokenTimestampInSecond;
  }

  static setUpdateTokenTimestampInSecond() {
    lastUpdateTokenTimestampInSecond = Date.now() / 1000;
  }

  /**
   * Sleep in milliseconds
   * @param {Number} time
   */
  static async sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
// We export sleep function for avoiding old test scripts
// broken
exports.sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
exports.TimerHelper = TimerHelper;
