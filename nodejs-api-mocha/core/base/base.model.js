const { isBoolean, isNumber } = require('lodash');
const { getTransactionDateRange } = require('../../services/common/features/getTransactionDateRange');

/**
 * @abstract
 */
class BaseModel {
  /**
   * @param {Object} option
   * @param {boolean} [option.isCompleted]
   * @param {number} [option.daysBefore] - fromDate = currentDate - daysBefore
   * @param {number} [option.daysAfter] - toDate = currentDate + daysAfter
   * @param {boolean} [option.alwaysGetLatest]
   * @param {boolean} [option.isGlobal]
   */
  constructor(option = {}) {
    const { isCompleted, daysBefore, daysAfter, alwaysGetLatest, isGlobal } = option;
    this._dataDetail = null;
    this.isGlobal = true;
    this.isCompleted = false;
    this.alwaysGetLatest = false;
    this.daysBefore = 0;
    this.daysAfter = 0;
    this.fromDate = 0;
    this.toDate = 0;
    this.setIsGlobal(isGlobal);
    this.setIsCompleted(isCompleted);
    this.setAlwaysGetLatest(alwaysGetLatest);
    this.setDateRange(daysBefore, daysAfter);
  }

  setAlwaysGetLatest(alwaysGetLatest) {
    if (isBoolean(alwaysGetLatest)) {
      this.alwaysGetLatest = alwaysGetLatest;
    }
  }

  setIsGlobal(isGlobal) {
    if (isBoolean(isGlobal) && isGlobal !== this.isGlobal) {
      this.isGlobal = isGlobal;
      this._dataDetail = null;
    }
  }

  setIsCompleted(isCompleted) {
    if (isBoolean(isCompleted) && isCompleted !== this.isCompleted) {
      this.isCompleted = isCompleted;
      this._dataDetail = null;
    }
  }

  setDaysBefore(daysBefore) {
    if (isNumber(daysBefore) && daysBefore !== this.daysBefore) {
      this.daysBefore = daysBefore;
    }
  }

  setDaysAfter(daysAfter) {
    if (isNumber(daysAfter) && daysAfter !== this.daysAfter) {
      this.daysAfter = daysAfter;
    }
  }

  setDateRange(daysBefore, daysAfter) {
    this.setDaysBefore(daysBefore);
    this.setDaysAfter(daysAfter);
    const { fromDate, toDate } = getTransactionDateRange(this.daysBefore, this.daysAfter);
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  async getDataDetail() {
    if (this.alwaysGetLatest || !this._dataDetail) {
      await this.getLatest();
    }
    return this._dataDetail;
  }

  async getStrDataDetail() {
    const dataDetail = this._dataDetail || await this.getDataDetail();
    return JSON.stringify(dataDetail, null, 2);
  }

  /**
   * @protected
   */
  async getLatest() {
    this._dataDetail = null;
  }
}

exports.BaseModel = BaseModel;
