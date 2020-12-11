const { LoggerHelper } = require('../../log4js');

const LISTENER_TYPE = {
  START_SUITE: 'suite',
  END_SUITE: 'suite end',
  START_TEST: 'test',
  END_TEST: 'test end',
  START_HOOK: 'hook',
  END_HOOK: 'hook end',
  PASS: 'pass',
  FAIL: 'fail',
  PENDING: 'pending',
  EXECUTION_START: 'waiting',
  EXECUTION_END: 'end'
};

/**
 * BaseListener class
 * allow user extend to create any listener method
 * Example
 * class SampleListener{
 *  constructor(mochaRunner){
 *  const listener = new BaseListener();
 *  listener.startSuite(mochaRunner,(ctx)=>{
 *     console.log(ctx.title);
 *   })
 *  }
 * }
 */

const log = new LoggerHelper('Listener');
const dispatchListenerMethod = (func, ctx) => {
  try {
    func(ctx);
  } catch (err) {
    log.error(err);
  }
};
class MochaListener {
  executionStart(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.EXECUTION_START, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }

  executionEnd(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.EXECUTION_END, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }

  startSuite(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.START_SUITE, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  endSuite(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.END_SUITE, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  startTest(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.START_TEST, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  endTest(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.END_TEST, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  hookStart(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.START_HOOK, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  hookEnd(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.END_HOOK, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  testPass(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.PASS, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  testFail(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.FAIL, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
  testPending(runner, listenerMethod) {
    runner.on(LISTENER_TYPE.PENDING, (ctx) => {
      dispatchListenerMethod(listenerMethod, ctx);
    });
  }
}

exports.MochaListener = MochaListener;
exports.LISTENER_TYPE = LISTENER_TYPE;
