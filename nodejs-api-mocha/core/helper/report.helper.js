// Use directly axios to avoid cache token in RestRequest service
const path = require('path');
const fs = require('fs');
const { default: axios } = require('axios');
const { listXmlFiles, mergeFiles, writeMergedFile } = require('junit-merge/lib');
const log4js = require('log4js');
const { TimerHelper } = require('./timer.helper');

const log = log4js.getLogger('ReportAgentClient');
const reportPortalAgents = new Map();
let failedTestScripts = [];
// Avoid having cyclic dependency between
// ReportAgent, ReportHelper and MochaReportPortalListener
let ReportAgentClazz = null;
const isReportPortalAlive = async (url) => {
  const request = axios.create({
    baseURL: url,
    timeout: 15000,
    headers: {}
  });
  await request.get('/');
  return true;
};
class ReportHelper {
  constructor() {
    throw new Error('Cannot construct singleton');
  }

  static set reportAgentClass(reportAgent) {
    if (!ReportAgentClazz) {
      ReportAgentClazz = reportAgent;
    }
  }

  static getAgent(reportKey) {
    return ReportHelper.getReportPortalAgent(reportKey);
  }

  static async createReportAgent(config, key) {
    const reportKeyStore = key || 'Default';
    const maxTry = 5;
    let currentRetry = 1;
    do {
      try {
        currentRetry++;
        if (await isReportPortalAlive(config.host)) {
          const agent = await new ReportAgentClazz(config);
          ReportHelper.storeReportPortalAgent(reportKeyStore, agent);
          log.debug('Create ReportAgent:', key);
          return agent;
        }
      } catch (err) {
        currentRetry++;
        log.error('Create ReportAgent Error:', err);
        await TimerHelper.sleep(currentRetry * 500);
      }
    } while (currentRetry <= maxTry);
    log.error('Cannot Create ReportAgent Error', key);
    throw new Error('ReportPortal Server Is Shutdown');
  }

  static async waitForAllAgentsCompleted() {
    const agents = reportPortalAgents.values();
    for (const agent of agents) {
      await agent.finishAllAgentRequests();
    }
  }
  static async clearAllReportPortalAgentStore() {
    // We keep the default report agent and the last agent
    // for multiple test context and reuse in retries test
    await ReportHelper.waitForAllAgentsCompleted();
    const defaultReportObject = reportPortalAgents.get(ReportHelper.defaultReportStoreKey);
    reportPortalAgents.clear();
    reportPortalAgents.set(ReportHelper.defaultReportStoreKey, defaultReportObject);
  }

  static async clearReportAgent(reportKey) {
    const agent = reportPortalAgents.get(reportKey);
    await agent.finishAllAgentRequests();
    reportPortalAgents.delete(reportKey);
  }

  static storeReportPortalAgent(reportKey, reportObject) {
    const reportKeyStore = reportKey || 'Default';
    reportPortalAgents.set(reportKeyStore, reportObject);
  }

  static getReportPortalAgent(reportKey) {
    const reportKeyStore = reportKey || 'Default';
    const reportAgentKeys = Array.from(reportPortalAgents.keys());
    for (const key of reportAgentKeys) {
      if (key.includes(reportKeyStore)) {
        return reportPortalAgents.get(key);
      }
    }
    throw new Error(`Invalid ReportPortal Key ${reportKey} or error in connect to ReportPortal Server`);
  }

  static async sendLaunchRequest(reportKey, ...data) {
    const agent = ReportHelper.getReportPortalAgent(reportKey);
    return agent.sendLaunchRequest(...data);
  }

  static sendTestItemRequest(reportKey, ...data) {
    const agent = ReportHelper.getReportPortalAgent(reportKey);
    agent.sendTestItemRequest(...data);
  }
  static sendLogItemRequest(reportKey, ...data) {
    try {
      const agent = ReportHelper.getReportPortalAgent(reportKey);
      agent.sendLogItemRequest(...data);
      log.debug('SEND LOG:', ...data);
    } catch (err) {
      log.error(err);
    }
  }
  static async finishAllAgentRequests(reportKey) {
    const agent = ReportHelper.getReportPortalAgent(reportKey);
    return agent.finishAllAgentRequests();
  }

  static get defaultReportStoreKey() {
    return 'Default';
  }

  static createReportPortalTag(rawData, keys) {
    keys = keys || [];
    rawData = rawData || {};
    return keys.map((key) => rawData[key]).filter((value) => value);
  }

  static createReportDescription(reportTags) {
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

  static reportPortalInfo(buildInfoData) {
    const buildTags = ReportHelper.createReportPortalTag(buildInfoData.build, ['version', 'number', 'date']);
    const serverTags = ReportHelper.createReportPortalTag(buildInfoData.server, ['hostname', 'nodeVersion']);
    const reportTags = buildTags.concat(serverTags);
    const reportDescription = ReportHelper.createReportDescription(reportTags);
    return { reportDescription, reportTags };
  }

  static get failedTestScripts() {
    return failedTestScripts;
  }

  static set failedTestScripts(filePath) {
    if (filePath) failedTestScripts.push(filePath);
  }

  static clearFailedTestScripts() {
    failedTestScripts = [];
  }

  static mergeJenkinsResult(rootPath, isParallel) {
    if (isParallel) {
      const listXMLResult = listXmlFiles(path.resolve(rootPath, 'reports'), true);
      const newXMLResultData = mergeFiles(listXMLResult);
      writeMergedFile(path.resolve(rootPath, 'reports', 'JUnitResult.xml'), newXMLResultData, true);
      listXMLResult.forEach((file) => fs.unlinkSync(file));
    }
  }
}

exports.ReportHelper = ReportHelper;
