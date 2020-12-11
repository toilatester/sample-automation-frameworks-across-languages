exports.config = ({
  url, headless, getPageTimeout, waitForAction, waitForTimeout, width, height, isFullScreen
}) => {
  return {
    url,
    show: !headless,
    getPageTimeout,
    waitForAction,
    waitForTimeout,
    waitForNavigation: ['networkidle0'],
    uniqueScreenshotNames: true,
    fullPageScreenshots: true,
    chrome: {
      defaultViewport: {
        width,
        height
      },
      args: isFullScreen
        ? ['--start-fullscreen', `--window-size=${width},${height}`]
        : [`--window-size=${width},${height}`]
    }
  };
};
