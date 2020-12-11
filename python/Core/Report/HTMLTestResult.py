from datetime import datetime
from unittest import TextTestResult, TestCase
from Core.Report.TestCaseResult import TestResultInfo
from Core.Helper.Constant import TestStatus
from Core.Base.BaseTest import BaseTest
from unittest.result import TestResult
from typing import List


class HTMLTestResult(TextTestResult):

    def __init__(self, stream, descriptions, verbosity):
        TextTestResult.__init__(self, stream, descriptions, verbosity)
        self.__suite_start_time = None
        self.__suite_end_time = None
        self.__start_test_time = None
        self.__end_test_time = None
        self.__init_props()

    def __init_props(self):
        self.__skipped_test: List['TestResultInfo'] = []
        self.__passed_test: List['TestResultInfo'] = []
        self.__failed_test: List['TestResultInfo'] = []
        self.__expected_failed_test: List['TestResultInfo'] = []
        self.__unexpected_successes_test: List['TestResultInfo'] = []
        self.__error_test: List['TestResultInfo'] = []

    @property
    def get_total_test_classes_pass(self) -> int:
        passed_classes = [c.test_class_name for c in self.__passed_test]
        expected_failed_classes = [c.test_class_name for c in self.__expected_failed_test]
        total_pass = passed_classes + expected_failed_classes
        return len(set(total_pass))

    @property
    def get_total_test_classes_fail(self) -> int:
        failed_classes = [c.test_class_name for c in self.__failed_test]
        unexpected_success_classes = [c.test_class_name for c in self.__unexpected_successes_test]
        total_fail = failed_classes + unexpected_success_classes
        return len(set(total_fail))

    @property
    def get_total_test_classes_other(self) -> int:
        skipped_classes = [c.test_class_name for c in self.__skipped_test]
        error_classes = [c.test_class_name for c in self.__error_test]
        total_other = skipped_classes + error_classes
        return len(set(total_other))

    @property
    def get_total_test_pass(self) -> int:
        return len(self.__passed_test)

    @property
    def get_total_test_fail(self) -> int:
        return len(self.__failed_test)

    @property
    def get_total_test_error(self) -> int:
        return len(self.__error_test)

    @property
    def get_total_test_skip(self) -> int:
        return len(self.__skipped_test)

    @property
    def get_total_test_expected_fail(self) -> int:
        return len(self.__expected_failed_test)

    @property
    def get_total_test_unexpected_success(self) -> int:
        return len(self.__unexpected_successes_test)

    @property
    def passed_tests(self) -> List['TestResultInfo']:
        return self.__passed_test

    @property
    def failed_tests(self) -> List['TestResultInfo']:
        return self.__failed_test

    @property
    def skipped_tests(self) -> List['TestResultInfo']:
        return self.__skipped_test

    @property
    def expected_failed_tests(self) -> List['TestResultInfo']:
        return self.__expected_failed_test

    @property
    def unexpected_successes_tests(self) -> List['TestResultInfo']:
        return self.__unexpected_successes_test

    @property
    def errors_tests(self) -> List['TestResultInfo']:
        return self.__error_test

    @property
    def suite_execution_time(self):
        return self.__suite_end_time - self.__suite_start_time

    def startTestRun(self):
        super().startTestRun()
        self.__suite_start_time = datetime.now()

    def startTest(self, test):
        super().startTest(test)
        self.__start_test_time = datetime.now()

    def addExpectedFailure(self, test, err):
        TestResult.addExpectedFailure(self, test, err)
        self.stream.write("EXPECTED FAILED")
        self.stream.write(" ... msg: " + str(err[1]))
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__expected_failed_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.EXPECTED_FAIL, error_msg=err,
                           custom_msg=self.__get_api_payload_gui_screenshot(test)))

    def addUnexpectedSuccess(self, test):
        TestResult.addUnexpectedSuccess(self, test)
        self.stream.write("UNEXPECTED SUCCESS")
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__unexpected_successes_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.UNEXPECTED_SUCCESS))

    def addSuccess(self, test: TestCase):
        TestResult.addSuccess(self, test)
        self.stream.write("PASSED")
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__passed_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.PASS))

    def addError(self, test: TestCase, err):
        TestResult.addError(self, test, err)
        self.stream.write("ERROR")
        self.stream.write(" ... msg: " + str(err[1]))
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__error_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.ERROR, error_msg=err,
                           custom_msg=self.__get_api_payload_gui_screenshot(test)))

    def addFailure(self, test: TestCase, err):
        TestResult.addFailure(self, test, err)
        self.stream.write("FAILED")
        self.stream.write(" ... msg: " + str(err[1]))
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__failed_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.FAIL, error_msg=err,
                           custom_msg=self.__get_api_payload_gui_screenshot(test)))

    def addSkip(self, test: TestCase, reason):
        TestResult.addSkip(self, test, reason)
        self.stream.write("SKIPPED")
        self.stream.write(" ... reason: " + str(reason))
        self.stream.writeln()
        execution_time = self.__get_test_execution_time()
        self.__skipped_test.append(
            TestResultInfo(test=test, execution_time=execution_time, status_id=TestStatus.SKIP,
                           error_msg=reason))

    def stopTest(self, test):
        super().stopTest(test)

    def stopTestRun(self):
        super().stopTestRun()
        self.__suite_end_time = datetime.now()

    def __get_test_execution_time(self):
        self.__end_test_time = datetime.now()
        return self.__end_test_time - self.__start_test_time

    def __get_api_payload_gui_screenshot(self, test: BaseTest):
        return test.API_PAY_LOAD if test.is_api_test else test.GUI_SCREEN_SHOT

    def __repr__(self):
        str_return = (
            "{0} Test Result Summary: Total run {1} tests"
            "(Failures={2}, Errors={3}, "
            "Unexpected Successes={4}, "
            "Skipped={5}, Expected Failures={6}, "
            "Passed={7})".format(self.__class__,
                                 self.testsRun, len(self.failed_tests),
                                 len(self.errors_tests), len(self.unexpected_successes_tests),
                                 len(self.skipped_tests), len(self.expected_failed_tests), len(self.passed_tests)))
        return str_return
