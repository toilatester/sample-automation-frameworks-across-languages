import os
import unittest
import traceback
import threading
from Core.Config.DriverFactory import DriverFactory
from Config import YAML_CONFIG
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage.CreateBotPage import CreateBotPage
from GUI.POM.Dashboard.DashboardPage import DashboardPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Core.Exceptions.TestContextException import TestContextException


class RepeatedTest(object):
    def __init__(self, repeated_number: int = 0, parallel=False, thread_count=4, is_continue=True):
        self.__repeated_number = 1 if repeated_number == 0 else repeated_number
        self.__parallel = parallel
        self.__thread_count = thread_count
        self.__is_continue = is_continue
        self.__result = []

    def __call__(self, test_func):
        def wrapped_test(*args):
            test_class = args[0]
            setup_method = getattr(test_class, "repeated_setup")
            teardown_method = getattr(test_class, "repeated_teardown")
            if self.__parallel:
                self.__invoke_test_parallel(setup_method, teardown_method, test_func, *args)
            else:
                self.__invoke_test_single_thread(setup_method, teardown_method, test_func, *args)

        return wrapped_test

    def __invoke_test_parallel(self, setup_method, teardown_method, test_func, *args):
        list_thread = []
        for i in range(0, self.__repeated_number, 1):
            thread_name = "Repeated Test " + str(
                i)
            list_thread.append(threading.Thread(target=self.__invoke_test, name=thread_name,
                                                args=(i, setup_method, teardown_method, test_func, *args)))

        count = int(self.__repeated_number / self.__thread_count)
        for index in range(0, count, 1):
            for t in list_thread[self.__thread_count * index: (self.__thread_count * index) + self.__thread_count]:
                t.start()
            for t in list_thread[self.__thread_count * index: (self.__thread_count * index) + self.__thread_count]:
                t.join()
        if len(self.__result) > 0:
            msg = "\n".join(self.__result)
            raise AssertionError("\n" + msg)

    def __invoke_test_single_thread(self, setup_method, teardown_method, test_func, *args):
        for i in range(0, self.__repeated_number, 1):
            self.__invoke_test(i, setup_method, teardown_method, test_func, *args)
        if len(self.__result) > 0:
            msg = "\n".join(self.__result)
            raise AssertionError("\n" + msg)

    def __invoke_test(self, i, setup_method, teardown_method, test_func, *args):
        try:
            print("Run cycle {}".format(i + 1))
            self.__invoke_hook_method(setup_method)
            test_func(*args)
            self.__invoke_hook_method(teardown_method)
        except (TestContextException, Exception) as e:
            tb = (traceback.format_tb(e.__traceback__))
            print(tb)
            self.__result.append("Test Run {}: \n".format(i) + "\n".join(tb))

    def __invoke_hook_method(self, func):
        try:
            func()
        except (TestContextException, Exception) as e:
            if not self.__is_continue:
                raise TestContextException(e)


class BaseTest(unittest.TestCase):
    API_PAY_LOAD = []
    GUI_SCREEN_SHOT = []

    def __init__(self, *args, **kwargs):
        unittest.TestCase.__init__(self, *args, **kwargs)
        self.__api_test = os.environ.get('api', False)
        self.TEST_CLASS = self
        self.__login = LoginPage()
        self.__register = RegisterPage()
        self.__dashboard = DashboardPage()
        self.__create_bot = CreateBotPage()
        self.__data = DataGenerateUtils()

    def setUp(self):
        self.API_PAY_LOAD = []
        if not self.is_api_test:
            DriverFactory.create_driver()

    def repeated_setup(self):
        pass

    def repeated_teardown(self):
        pass

    def tearDown(self):
        if not self.is_api_test:
            DriverFactory.dispose_driver()

    @property
    def is_api_test(self):
        return self.__api_test

    @is_api_test.setter
    def is_api_test(self, is_api_test):
        self.__api_test = is_api_test

    def sign_in_for_ui_test(self, username=None, email=None, password=None,
                            bot_name=None, faq_url=None, is_debugging=False):
        try:
            if not is_debugging:
                # Generate data
                email = email or self.__data.create_email()
                username = username or self.__data.create_name()
                password = password or self.__data.create_password()
                bot_name = bot_name or self.__data.create_uuid_number()
                invalid_faq = faq_url or YAML_CONFIG.get("stub_invalid_faq_url")

                self.__register.open_register_page()
                self.__register.login_with_new_account(username,
                                                       email,
                                                       password)
                self.__create_bot.wait_for_create_page()
                self.__create_bot.create_bot_with_data(bot_name,
                                                       invalid_faq)
            else:
                email = email or YAML_CONFIG.get("email_for_debugging")
                password = password or YAML_CONFIG.get("pass_for_debugging")
                self.__login.login_with_account(email, password)
                self.__dashboard.wait_for_dashboard_page()

        except Exception as e:
            raise TestContextException(e)

    @staticmethod
    def assert_container(func, expected, actual):
        return lambda: func(expected, actual)
