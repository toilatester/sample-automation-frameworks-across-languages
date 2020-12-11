const path = require("path");

class Log4jsReportPortal {
  constructor(agentReportPortal, agentReportPortalListener) {
    this.agentReportPortal = agentReportPortal;
    this.agentReportPortalListener = agentReportPortalListener;
    this.reportPortalAppender = this.reportPortalAppender.bind(this);
    this.configure = this.configure.bind(this);
  }
  reportPortalAppender(layout, timezoneOffset) {
    // This is the appender function itself
    const reportPortalObject = this.agentReportPortalListener.getReportPortalObject();
    return (loggingEvent) => {
      const logLevel = loggingEvent.level;
      let testItemId = this.agentReportPortalListener.getParentId();
      testItemId = testItemId ? testItemId : reportPortalObject.getLaunchId();
      testItemId = testItemId ? testItemId : reportPortalObject.getTestItemsId();
      console.log(testItemId);
      this.agentReportPortal.client.sendLog(testItemId, {
        message: layout(loggingEvent, timezoneOffset),
        level: logLevel.levelStr
      })
    };
  }
  configure(config, layouts) {
    // the default layout for the appender
    let layout = layouts.colouredLayout;
    // check if there is another layout specified
    if (config.layout) {
      // load the layout
      layout = layouts.layout(config.layout.type, config.layout);
    }
    //create a new appender instance
    return this.reportPortalAppender(layout, config.timezoneOffset);
  }
}

exports.Log4jsReportPortal = Log4jsReportPortal;