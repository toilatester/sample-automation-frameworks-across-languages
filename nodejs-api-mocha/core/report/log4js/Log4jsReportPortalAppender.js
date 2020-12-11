const getRawLogMessage = (loggingEvent, layout, timezoneOffset) => {
  const data = loggingEvent.data;
  return data
    .map((item) => {
      if (item instanceof Error) return layout(loggingEvent, timezoneOffset);
      if (item instanceof Object) return JSON.stringify(item);
      return item;
    })
    .join('\n');
};
class Log4jsReportPortal {
  constructor(agent) {
    this.agent = agent;
    this.reportPortalAppender = this.reportPortalAppender.bind(this);
    this.configure = this.configure.bind(this);
  }
  reportPortalAppender(layout, timezoneOffset) {
    // This is the appender function itself
    return (loggingEvent) => {
      const categoryName = loggingEvent.categoryName;
      const invalidSendReportPortalLog = categoryName === 'ExecutionLog' || categoryName === 'ReportAgentClient';
      const isValidReportPortalData = !this.agent || invalidSendReportPortalLog;
      // Only send log to report portal if valid test context
      // Ingore another log in another category
      if (isValidReportPortalData) return;
      const logLevel = loggingEvent.level;
      const rawMessage = getRawLogMessage(loggingEvent, layout, timezoneOffset);
      const logMessage = rawMessage.includes('MARKDOWN_MODE')
        ? `${rawMessage}\n### TEST CONTEXT: ${categoryName}`
        : `!!!MARKDOWN_MODE!!!\n### TEST CONTEXT: ${categoryName}\n### ${logLevel} DATA:\n\`\`\`javacript\n${rawMessage}\n\`\`\`\n`;
      const sendLogItemMethod = this.getSendLogToReportPortalMethod();
      sendLogItemMethod(
        {
          message: logMessage,
          level: logLevel.levelStr
        },
        categoryName
      );
    };
  }

  getSendLogToReportPortalMethod() {
    return this.agent.constructor.name === 'ReportPortalAgent'
      ? (data) => this.agent.sendLogItemRequest(data)
      : (data, reportKeyStore) => {
        this.agent.sendLogItemRequest(reportKeyStore, data);
      };
  }

  configure(config, layouts) {
    // the default layout for the appender
    let layout = layouts.basicLayout;
    // check if there is another layout specified
    if (config.layout) {
      // load the layout
      layout = layouts.layout(config.layout.type, config.layout);
    }
    // create a new appender instance
    return this.reportPortalAppender(layout, config.timezoneOffset);
  }
}

exports.Log4jsReportPortal = Log4jsReportPortal;
