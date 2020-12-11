const moment = require('moment');
const parseFormat = require('moment-parseformat');
const faker = require('faker');

moment.parseFormat = function format(...args) {
  parseFormat(...args);
};

class DateTimeUtils {
  static getCurrentDateWithDateFormat(dateFormat) {
    try {
      return moment.utc(Date.now()).format(dateFormat);
    } catch (err) {
      throw new Error('Date Format is invalid', err);
    }
  }

  static convertDateStringFormat(dateValue, newFormat) {
    return moment(dateValue, parseFormat(dateValue)).format(newFormat);
  }

  static convertUTCToDateTimeFormat(utcValue, dateFormat) {
    try {
      return moment.utc(utcValue).format(dateFormat);
    } catch (err) {
      throw new Error('Date Format is invalid', err);
    }
  }

  /**
   *
   * Returns a date between N years into the future.
   * @param {Number} yearRange
   * @param {String} dateFormat
   *
   * Ex: generateFutureDateWithFormat(1,'DD/MM/YY')
   * It will return a date in the future has date = current_date + 1
   */
  static getFutureDateWithFormat(dateRange, dateFormat) {
    const currentDate = new Date();
    const futureDate = new Date();
    return moment.utc(futureDate.setDate(currentDate.getDate() + dateRange)).format(dateFormat);
  }
}
exports.DateTimeUtils = DateTimeUtils;
