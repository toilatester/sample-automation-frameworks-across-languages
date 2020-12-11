// Use directly axios to avoid cache token in RestRequest service
const { default: axios } = require('axios');

const reportPortalAgents = {};

// Avoid having cyclic dependency between
// ReportAgent, ReportPortalHelper and MochaReportPortalListener
let ReportAgentClazz = null;
let reportTags = [];
let reportDescription = '';
const isReportPortalAlive = async (url) => {
  const request = axios.create({
    baseURL: url,
    timeout: 15000,
    headers: {}
  });
  await request.get('/');
  return true;
};
class ReportPortalHelper {
  constructor() {
    throw new Error('Cannot construct singleton');
  }

  static set reportAgentClass(reportAgent) {
    if (!ReportAgentClazz) {
      ReportAgentClazz = reportAgent;
    }
  }

  static getAgent(reportKey) {
    return ReportPortalHelper.getReportPortalAgent(reportKey);
  }

  static async createReportAgent(config, key) {
    const reportKeyStore = key || 'Default';
    try {
      if (await isReportPortalAlive(config.host)) {
        const agent = await new ReportAgentClazz(config);
        ReportPortalHelper.storeReportPortalAgent(reportKeyStore, agent);
        return agent;
      }
    } catch (err) {
      throw new Error(`Error in create ReportAgent ${err.message}`);
    }
    throw new Error('ReportPortal Server Is Shutdown');
  }

  static storeReportPortalAgent(reportKey, reportObject) {
    const reportKeyStore = reportKey || 'Default';
    reportPortalAgents[reportKeyStore] = reportObject;
  }

  static getReportPortalAgent(reportKey) {
    const reportKeyStore = reportKey || 'Default';
    const reportAgentKeys = Object.keys(reportPortalAgents);
    if (reportAgentKeys.includes(reportKeyStore)) {
      return reportPortalAgents[reportKeyStore];
    }
    throw new Error(`Invalid ReportPortal Key ${reportKey} or error in connect to ReportPortal Server`);
  }

  static async sendLaunchRequest(reportKey, ...data) {
    const agent = ReportPortalHelper.getReportPortalAgent(reportKey);
    return agent.sendLaunchRequest(...data);
  }

  static sendTestItemRequest(reportKey, ...data) {
    const agent = ReportPortalHelper.getReportPortalAgent(reportKey);
    agent.sendTestItemRequest(...data);
  }

  static sendLogItemRequest(reportKey, ...data) {
    const agent = ReportPortalHelper.getReportPortalAgent(reportKey);
    agent.sendLogItemRequest(...data);
  }

  static async finishAllAgentRequests(reportKey) {
    const agent = ReportPortalHelper.getReportPortalAgent(reportKey);
    return agent.finishAllAgentRequests();
  }

  static get defaultReportStoreKey() {
    return 'Default';
  }

  static get reportTags() {
    return reportTags;
  }

  static set reportTags(tags) {
    if (tags) reportTags = tags;
  }

  static get reportDescription() {
    return reportDescription;
  }

  static set reportDescription(description) {
    if (description) reportDescription = description;
  }
}

exports.ReportPortalHelper = ReportPortalHelper;
