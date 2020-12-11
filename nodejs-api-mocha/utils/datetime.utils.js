const moment = require('moment');

/**
 * Convert a date with input format to a millisecond (timestamp)
 * EX: moment("2017-12-04", 'YYYY-MM-DD').valueOf(); => 1512320400000
 * @param {date} date
 * @param {String} format
 * @param {String} startend - 'start' / 'end', default is 'start'
 * @returns (number)
 */

function convertDateToMilliSecond(date, format, startend = 'start') {
  let result;
  if (startend === 'start')
    result = moment(date, format).startOf('day').valueOf();
  else
    result = moment(date, format).endOf('day').valueOf();
  return result;
}

function getCurrentDate(format) {
  return moment().format(format);
}

function getCurrentTime() {
  const currentTime = new Date().getTime();
  return currentTime;
}

function addDay(date, numberDay, format) {
  return moment(date, format).add(numberDay, 'day').format(format);
}

function subtractDay(date, numberDay, format) {
  return moment(date, format).subtract(numberDay, 'day').format(format);
}

function verifyDateBetween(date, fromDate, toDate, format) {
  return moment(date, format).isBetween(moment(fromDate, format), moment(toDate, format), null, '[]');
}

function formatToDateType(date, inputFormat, expectFormat) {
  return moment(date, inputFormat).format(expectFormat);
}
/**
 * Created by: Thao Do
 * Created date: 11/29/2017
 * Updated by: Cuc Doan
 * Updated date: 8/1/2018
 * unitOfTime:
 *** years 	y
 *** quarters 	Q
 *** months 	M
 *** weeks 	w
 *** days 	d
 *** hours 	h
 *** minutes 	m
 *** seconds 	s
 *** milliseconds 	ms
 */
function getFromDateAndToDate(previousDays, nextDays, unitOfTime) {
  const fromDate = moment().subtract(previousDays, unitOfTime).startOf(unitOfTime).toDate().getTime();
  const toDate = moment().add(nextDays,unitOfTime).endOf(unitOfTime).toDate().getTime();
  return {from: fromDate, to: toDate};
}

module.exports = {
  convertDateToMilliSecond,
  getCurrentDate,
  addDay,
  subtractDay,
  verifyDateBetween,
  getCurrentTime,
  formatToDateType,
  getFromDateAndToDate
};