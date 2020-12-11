exports.config = ({
  url,
  host,
  port,
  protocol,
  path,
  getPageTimeout,
  waitForAction,
  waitForTimeout,
  width,
  height,
  isFullScreen,
  desiredCapabilities
}) => {
  return {
    url,
    host,
    port,
    protocol,
    browser: 'chrome',
    path,
    windowSize: isFullScreen ? 'maximize' : `${width}x${height}`,
    getPageTimeout,
    waitForAction,
    waitForTimeout,
    smartWait: 10000,
    uniqueScreenshotNames: true,
    fullPageScreenshots: true,
    desiredCapabilities,
    timeouts: {
      script: getPageTimeout,
      'page load': getPageTimeout
    }
  };
};
