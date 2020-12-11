/**
 *
 * @param {*} text : pre-fix of string need to generate
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
module.exports = {
  sleep
};