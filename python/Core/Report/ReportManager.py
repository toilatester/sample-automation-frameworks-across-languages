from Core.Report.TestCaseResult import TestResultInfo
from Core.Runner.Template import TEMPLATE_FOLDER_PATH, TEMPLATE_FILE_NAME
from Core.Exceptions.TestContextException import TestContextException
from Core.Runner.TestRunnerHtml import HTMLTestResult
from TestResult import REPORT_PATH
from typing import List
import jinja2
from datetime import datetime
import os


class ReportManager(object):
    HTML_TEMPLATE_FILE_NAME = "index.html"

    def __init__(self, test_result: HTMLTestResult, os_version="N/A", browser="N/A", build_version="N/A",
                 test_environment="N/A",
                 execute_mode="N/A"):
        self.__result = test_result
        self.__os = os_version
        self.__browser = browser
        self.__build_version = build_version
        self.__test_environment = test_environment
        self.__execute_mode = execute_mode
        self.__detail_result = []

    def generate_html_report(self,
                             report_file_name="TestReport",
                             report_dir=None):
        generate_report_successfully = False
        try:
            report_file_name = report_file_name + "_" + datetime.now().strftime("%Y_%m_%d_%H_%M_%S_%f") + ".html"
            report_dir = REPORT_PATH if report_dir is None else report_dir
            report_path = os.path.join(report_dir, report_file_name)
            env = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_FOLDER_PATH, followlinks=True))
            template = env.get_template(TEMPLATE_FILE_NAME)
            context = self.__init_report_context()
            html_source_string = template.render(context)
            if html_source_string is None:
                raise Exception("error in generate html report")
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(html_source_string)
            print("Done generate report in {}".format(report_path))
            generate_report_successfully = True
        finally:
            if not generate_report_successfully:
                print("Has error in generate HTML report")

    def __init_report_context(self):
        self.__parsing_detail_table()
        context = {
            'build_version': self.__build_version,
            'test_environment': self.__test_environment,
            'browser': self.__browser,
            'os': self.__os,
            'execute_mode': self.__execute_mode,
            'execute_time': self.__result.suite_execution_time,
            'pass': self.__result.get_total_test_pass,
            'fail': self.__result.get_total_test_fail,
            'error': self.__result.get_total_test_error,
            'skip': self.__result.get_total_test_skip,
            'unexpected_success': self.__result.get_total_test_unexpected_success,
            'expected_fail': self.__result.get_total_test_expected_fail,
            'class_pass': self.__result.get_total_test_classes_pass,
            'class_fail': self.__result.get_total_test_classes_fail,
            'class_other': self.__result.get_total_test_classes_other,
            'datetime': datetime.now(),
            'total_pass': self.__result.get_total_test_pass + self.__result.get_total_test_expected_fail,
            'total_fail': self.__result.get_total_test_fail + self.__result.get_total_test_unexpected_success,
            'total_other': self.__result.get_total_test_skip + self.__result.get_total_test_error,
            'detail_test_table': self.__detail_result
        }
        return context

    def __parsing_detail_table(self):
        self.__parsing_test_result_to_table_report(self.__result.failed_tests)
        self.__parsing_test_result_to_table_report(self.__result.errors_tests)
        self.__parsing_test_result_to_table_report(self.__result.unexpected_successes_tests)
        self.__parsing_test_result_to_table_report(self.__result.skipped_tests)
        self.__parsing_test_result_to_table_report(self.__result.passed_tests)
        self.__parsing_test_result_to_table_report(self.__result.expected_failed_tests)
        if self.__result.testsRun != len(self.__detail_result):
            raise TestContextException("Has error in generate HTML report")

    def __parsing_test_result_to_table_report(self, result: List['TestResultInfo']):
        self.__detail_result.extend(
            [test.test_case_id, test.test_case_name, test.test_status, str(test.execution_time_test),
             test.error_msg] for test in
            result)
