// const log4js = require('log4js');
// const {
//   BaseAgent
// } = require('../BaseAgent');
// const {
//   Constant
// } = require('../helper');
// const reportConfig = require('../config/reportportal.json');
// const {
//   LoggerHelper
// } = require('../../log4js');
// log4js.configure({
//   appenders: {
//     out: {
//       type: 'stdout',
//       layout: {
//         type: 'basic'
//       }
//     },
//     multi: {
//       type: 'multiFile',
//       base: 'logs/',
//       property: 'categoryName',
//       extension: '.log',
//       layout: {
//         type: 'basic'
//       }
//     }
//   },
//   categories: {
//     default: {
//       appenders: ['multi'],
//       level: 'all'
//     }
//   }
// });
// const baseAgent = new BaseAgent(reportConfig);

// baseAgent.startLaunch();

// // baseAgent.startBeforeSuite({
// //   description: "This is debug to build report portal before suite",
// //   fullName: "Before Suite"
// // });

// // baseAgent.finishBeforeSuite(Constant.TEST_STATUS.PASSED);

// baseAgent.startSuite({
//   description: "This is debug to build report portal test suite",
//   fullName: "Test Suite"
// })

// // baseAgent.startBeforeTest({
// //   description: "This is debug to build report portal before test script",
// //   fullName: "Before Test Method"
// // });
// // baseAgent.finishBeforeTest(Constant.TEST_STATUS.PASSED);

// baseAgent.startTest({
//   description: "This is debug to build report portal test script",
//   fullName: "Test Method"
// })

// // baseAgent.startScenario({
// //   description: "This is debug to build report portal test script",
// //   fullName: "Scenario A"
// // })

// // ///// Step 1 ////////

// // baseAgent.startBeforeMethod({
// //   description: "This is debug to build report portal before method",
// //   fullName: "Before Method"
// // });
// // baseAgent.finishBeforeMethod(Constant.TEST_STATUS.PASSED);

// baseAgent.startStep({
//   description: "This is debug to build report portal test step",
//   fullName: "Login To Home Page"
// }, baseAgent.getReportPortalObject().getTestItemsId())

// baseAgent.logStepInfo({
//   message: "Input to username",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Input to pass",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Click to login",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Navigate to Home",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.finishStep(Constant.TEST_STATUS.PASSED);
// // baseAgent.startAfterMethod({
// //   description: "This is debug to build report portal after method",
// //   fullName: "After Method"
// // });
// // baseAgent.finishAfterMethod(Constant.TEST_STATUS.PASSED);

// // ///// Step 2 ////////

// // baseAgent.startBeforeMethod({
// //   description: "This is debug to build report portal before method",
// //   fullName: "Before Method"
// // });
// // baseAgent.finishBeforeMethod(Constant.TEST_STATUS.PASSED);

// baseAgent.startStep({
//   description: "This is debug to build report portal test step",
//   fullName: "Login To Home Page"
// }, baseAgent.getReportPortalObject().getTestItemsId())

// baseAgent.logStepInfo({
//   message: "Input to username",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Input to pass",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Click to login",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Navigate to Home",
//   level: Constant.LOG_LEVEL.INFO
// })
// baseAgent.finishStep(Constant.TEST_STATUS.PASSED);

// // baseAgent.startAfterMethod({
// //   description: "This is debug to build report portal after method",
// //   fullName: "After Method"
// // });
// // baseAgent.finishAfterMethod(Constant.TEST_STATUS.PASSED);

// // /// Step 3 ////

// // baseAgent.startBeforeMethod({
// //   description: "This is debug to build report portal before method",
// //   fullName: "Before Method"
// // });
// // baseAgent.finishBeforeMethod(Constant.TEST_STATUS.PASSED);

// baseAgent.startStep({
//   description: "This is debug to build report portal test step",
//   fullName: "Login To Home Page"
// }, baseAgent.getReportPortalObject().getTestItemsId())

// baseAgent.logStepInfo({
//   message: "Input to username",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Input to pass",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Click to login",
//   level: Constant.LOG_LEVEL.INFO
// })

// baseAgent.logStepInfo({
//   message: "Navigate to Home",
//   level: Constant.LOG_LEVEL.INFO
// })
// baseAgent.finishStep(Constant.TEST_STATUS.PASSED);

// // baseAgent.startAfterMethod({
// //   description: "This is debug to build report portal after method",
// //   fullName: "After Method"
// // });
// // baseAgent.finishAfterMethod(Constant.TEST_STATUS.PASSED);

// // // End Scenario 

// // baseAgent.finishScenario(Constant.TEST_STATUS.PASSED);

// baseAgent.finishTest(Constant.TEST_STATUS.PASSED);

// // baseAgent.startAfterTest({
// //   description: "This is debug to build report portal after Test",
// //   fullName: "After Test"
// // });
// // baseAgent.finishAfterTest(Constant.TEST_STATUS.PASSED);

// baseAgent.finishSuite(Constant.TEST_STATUS.PASSED);

// // baseAgent.startAfterSuite({
// //   description: "This is debug to build report portal after suite",
// //   fullName: "After Suite"
// // });
// // baseAgent.finishAfterSuite(Constant.TEST_STATUS.PASSED);

// baseAgent.finishLaunch(Constant.TEST_STATUS.PASSED);