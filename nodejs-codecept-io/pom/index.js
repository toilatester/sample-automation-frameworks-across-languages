exports.Count = require.resolve('./count/count.steps.js');
exports.Home = require.resolve('./home/home.steps.js');
exports.Login = require.resolve('./login/login.steps.js');
exports.Order = require.resolve('./order/order.steps.js');
exports.Vendor = require.resolve('./vendor/vendor.steps.js');
const { ObjectUtils } = require('../core/utils');
/**
 * STEPS object hold all step objects for running test
 * We will add new step in this object
 */
const STEPS = {
  COMMON: { NAME: 'I', PATH: require.resolve('./common/base.steps.js') },
  AUTHENTICATE: { NAME: 'I_Authenticate', PATH: require.resolve('./login/login.steps.js') },
  HOME: { NAME: 'At_Home_I', PATH: require.resolve('./home/home.steps.js') },
  VENDOR: { NAME: 'At_Vendor_I', PATH: require.resolve('./vendor/vendor.steps.js') },
  COUNT: { NAME: 'At_Count_I', PATH: require.resolve('./count/count.steps.js') },
  ORDER: { NAME: 'At_Order_I', PATH: require.resolve('./order/order.steps.js') },
  RECEIVE: { NAME: 'At_Receive_I', PATH: require.resolve('./receive/receive.steps.js') }
};
ObjectUtils.freezeObject(STEPS);
exports.STEP_CONFIG = STEPS;
