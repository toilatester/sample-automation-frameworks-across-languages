class StringUtils {
  static convertUnitTelTypeToInt(data) {
    return parseInt(data.toString().replace(/,/gm, ''), 10);
  }

  static convertUnitToTelType(amount, decimalCount = 2, decimal = '.', thousands = ',') {
    decimalCount = Math.abs(decimalCount);
    decimalCount = Number.isNaN(decimalCount) ? 2 : decimalCount;
    const negativeSign = amount < 0 ? '-' : '';
    const amountString = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)), 10).toString();
    const subStringToAppendComma = amountString.length > 3 ? amountString.length % 3 : 0;
    return (
      negativeSign
      + (subStringToAppendComma ? amountString.substr(0, subStringToAppendComma) + thousands : '')
      + amountString.substr(subStringToAppendComma).replace(/(\d{3})(?=\d)/g, `$1${thousands}`)
      + (decimalCount
        ? decimal
          + Math.abs(amount - amountString)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  }
}

exports.StringUtils = StringUtils;
