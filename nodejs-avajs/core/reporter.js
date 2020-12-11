const { config } = require('../config');
const report = require('simple-ava-html-reporter');

const reportConf = config.reportconfig;

function reportGenerator() {
    report.generate({
        jsonDir: reportConf.jsonDir,
        reportPath: reportConf.reportPath,
        reportName: reportConf.reportName,
    });
}
reportGenerator();
exports.ReportGenerator = reportGenerator;
