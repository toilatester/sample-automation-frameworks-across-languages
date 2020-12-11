from unittest import TestCase
from Core.Helper.Constant import TestStatus
import traceback


class TestResultInfo(object):
    def __init__(self, test: TestCase, execution_time, status_id: int, error_msg=None, custom_msg=None):
        self.__test_case_object = test
        self.__test_case_name = self.__test_case_object.__str__()
        self.__test_status = TestStatus.get_status_string_by_id(status_id)
        self.__execution_time = execution_time
        self.__test_case_id = test.id()
        self.__error_msg = error_msg
        self.__custom_msg = custom_msg

    @property
    def test_class_name(self) -> str:
        return self.__test_case_object.__class__

    @property
    def test_case_name(self) -> str:
        return self.__test_case_name

    @property
    def test_case_id(self):
        return self.__test_case_id

    @property
    def test_status(self) -> str:
        return self.__test_status

    @property
    def execution_time_test(self):
        return self.__execution_time

    @property
    def error_msg(self) -> str:
        if isinstance(self.__error_msg, str):
            return "Skip reason: " + self.__error_msg
        if isinstance(self.__error_msg, tuple):
            return self.__get_exception_traceback()
        return "None"

    def __get_exception_traceback(self):
        msg = str(self.__custom_msg) + "\nAssert Error Message: " + str(self.__error_msg[1])
        for exception_object in self.__error_msg:
            msg = self.__convert_exception_to_msg(exception_object, msg)
        return msg

    def __convert_exception_to_msg(self, exception_object, msg):
        if isinstance(exception_object, Exception):
            tb = (traceback.format_tb(exception_object.__traceback__))
            for trace in reversed(tb):
                msg += str(trace) + "\n"
        return msg
