const ReportportalClient = require('reportportal-client');
const JasmineReportportalReporter = require('./JasmineReportportalReporter');

class JasmineReportportalAgent {
    constructor(config) {
        this.jasmineReportportalReporter = new JasmineReportportalReporter(config);
        // this.client = new ReportportalClient(config);
        // this.launchInstance = conf.id ? (this.client.startLaunch({
        //     id: conf.id
        // })) : (this.client.startLaunch({}));
        // this.tempLaunchId = this.launchInstance.tempId;
        // this.reporterConf = Object.assign({
        //     client: this.client,
        //     tempLaunchId: this.tempLaunchId,
        //     attachPicturesToLogs: true
        // }, conf);
    }

    getJasmineReporter() {
        return this.jasmineReportportalReporter;
    }

    /*
     * This method is used for launch finish when test run in one thread, and if test run in
     * multi treading it must be call at the parent process ONLY, after all child processes have
     * been finished
     *
     * @return a promise
     */
    getExitPromise() {
        const client = this.jasmineReportportalReporter.client;
        return (client.finishLaunch(this.tempLaunchId, {})).promise;
    }

    /*
     * This method is used for creating a Parent Launch at the Report Portal in which child launches would
     *  send their data
     *  during the promise resolve id of the launch could be ejected and sent as @param
     *  to the child launches.
     *
     *   @return a promise
     */
    getLaunchStartPromise() {
        return this.launchInstance.promise
    }

    /*
     * This method is used for frameworks as Jasmine and other. There is problems when
     * it doesn't wait for promise resolve and stop the process. So it better to call
     * this method at the spec's function as @afterAll() and manually resolve this promise.
     *
     * @return a promise
     */
    getPromiseFinishAllItems(launchTempId) {
        const client = this.jasmineReportportalReporter.client;
        return client.getPromiseFinishAllItems(launchTempId)
    }
}

module.exports = JasmineReportportalAgent;