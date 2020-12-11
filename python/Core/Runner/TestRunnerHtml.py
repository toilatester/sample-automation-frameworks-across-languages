import sys
from unittest import TextTestRunner, TestSuite
from unittest.signals import registerResult
from Core.Report.HTMLTestResult import HTMLTestResult
from Core.Report.ReportManager import ReportManager
from Core.Exceptions.TestContextException import TestContextException
from TestResult import REPORT_PATH


class HTMLTestRunner(TextTestRunner):
    """" A test runnUTFer class that output the results. """

    def __init__(self, report_file_name="TestReport",
                 report_dir=REPORT_PATH, verbosity=2,
                 descriptions=True, fail_fast=False, buffer=False):
        TextTestRunner.__init__(self, stream=sys.stderr, descriptions=descriptions, verbosity=verbosity,
                                failfast=fail_fast, buffer=buffer)
        self.elapsed_times = True
        self.result_class = HTMLTestResult
        self.report_dir = report_dir
        self.report_file_name = report_file_name
        self.result = self.__make_result()

    def __make_result(self) -> HTMLTestResult:
        """ Create a TestResult object which will be used to store
        information about the executed tests. """
        return self.result_class(self.stream, self.descriptions, self.verbosity)

    def run(self, test: TestSuite):
        """ Runs the given testcase or testsuite. """
        try:
            self.__init_test_result_config(test)
            self.__test_execution_invoke(test)
            self.__test_execution_post_process()
            return self.result
        except Exception as e:
            raise TestContextException("Has error in invoke test", e)

    def __init_test_result_config(self, test: TestSuite):
        registerResult(self.result)
        self.result.failfast = self.failfast
        self.result.buffer = self.buffer
        self.result.tb_locals = self.tb_locals
        self.result.fail_fast = self.failfast
        if hasattr(test, 'properties'):
            # junit test suite properties
            self.result.properties = test.properties

    def __test_execution_invoke(self, test):
        self.stream.writeln("=================== Execution Invoke ===========================")
        self.result.startTestRun()
        test(self.result)
        self.result.stopTestRun()
        self.stream.writeln("=================== Stop Execution Invoke ======================")

    def __test_execution_post_process(self):
        self.stream.writeln()
        run = self.result.testsRun
        self.stream.writeln("Executed {0} test in {2}{1}\n".format(run, "s" if run != 1 else "",
                                                                   self.result.suite_execution_time))
        list_result_info = self.__test_suite_failed_process()
        list_result_info.extend(self.__test_suite_unexpected_successes_process())
        list_result_info.extend(self.__test_suite_skip_process())
        list_result_info.extend(self.__test_suite_expected_fails_process())
        list_result_info.extend(self.__test_suite_pass_process())
        (lambda: len(list_result_info) > 0 and self.stream.writeln(
            "Test Result Summary: ({})".format(", ".join(list_result_info))))()
        self.__generate_html_report()

    def __test_suite_failed_process(self):
        list_result_info = []
        if not self.result.wasSuccessful():
            failed, errors = map(len, (self.result.failed_tests, self.result.errors))
            if failed:
                list_result_info.append("Failures={0}".format(failed))
            if errors:
                list_result_info.append("Errors={0}".format(errors))
        return list_result_info

    def __test_suite_unexpected_successes_process(self):
        list_result_info = []
        unexpected_successes = len(self.result.unexpected_successes_tests)
        if unexpected_successes:
            list_result_info.append("Unexpected Successes={}".format(unexpected_successes))
        return list_result_info

    def __test_suite_skip_process(self):
        list_result_info = []
        skipped = len(self.result.skipped_tests)
        if skipped:
            list_result_info.append("Skipped={}".format(skipped))
        return list_result_info

    def __test_suite_expected_fails_process(self):
        list_result_info = []
        expected_fails = len(self.result.expected_failed_tests)
        if expected_fails:
            list_result_info.append("Expected Failures={}".format(expected_fails))
        return list_result_info

    def __test_suite_pass_process(self):
        list_result_info = []
        passed = len(self.result.passed_tests)
        if passed:
            list_result_info.append("Passed={}".format(passed))
        return list_result_info

    def __generate_html_report(self):
        self.stream.writeln("Generate HTML Report ...")
        report = ReportManager(self.result)
        report.generate_html_report(report_dir=self.report_dir, report_file_name=self.report_file_name)
