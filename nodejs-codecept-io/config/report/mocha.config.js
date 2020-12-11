exports.config = (reportPath) => {
  return {
    reporterOptions: {
      reporterEnabled: 'mocha-jenkins-reporter,mochawesome-screenshots',
      mochaJenkinsReporterReporterOptions: {
        junit_report_path: `${reportPath}/mocha-reports/JUnitResult.xml`
      },
      mochawesomeScreenshotsReporterOptions: {
        reportDir: `${reportPath}/mocha-reports`
      },
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: true,
          steps: true
        }
      }
    }
  };
};
