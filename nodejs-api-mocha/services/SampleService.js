const BaseService = require('../core/base/base.service');

class BuildInfo extends BaseService {
  constructor() {
    super();
    this.__path = 'buildinfo';
  }
  async getBuildInfo() {
    this.request.namespace = '';
    return this.request.get({ path: this.__path });
  }

  async getReportPortalInformation() {
    const result = await this.getBuildInfo();
    const buildTags = this.createReportPortalTag(result.body.build, [
      'version',
      'number',
      'date'
    ]);
    const serverTags = this.createReportPortalTag(result.body.server, [
      'hostname',
      'nodeVersion'
    ]);
    const reportTags = buildTags.concat(serverTags);
    const reportDescription = this.createReportDescription(reportTags);
    return { tags: reportTags, description: reportDescription };
  }

  createReportDescription(reportTags) {
    reportTags = reportTags || ['empty', 'empty', 'empty', 'empty', 'empty'];
    const version = reportTags[0];
    const number = reportTags[1];
    const date = reportTags[2];
    const hostName = reportTags[3];
    const nodeVersion = reportTags[4];
    return (
      `** Build Version **\n*${version}*\n\n` +
      `** Build Number **\n*${number}*\n\n` +
      `** Build Date **\n*${date}*\n\n` +
      `** Server Host Name **\n*${hostName}*\n\n` +
      `** Server Node Version **\n*${nodeVersion}*\n\n`
    );
  }

  createReportPortalTag(rawData, keys) {
    keys = keys || [];
    rawData = rawData || {};
    return keys.map((key) => rawData[key]).filter((value) => value);
  }
}

exports.BuildInfo = BuildInfo;
