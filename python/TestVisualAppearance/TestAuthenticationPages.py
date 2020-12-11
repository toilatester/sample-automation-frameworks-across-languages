from Core.Base.BaseTest import BaseTest
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.ForgotPassword.ForgotPassword import ForgotPasswordPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Config import YAML_CONFIG
from applitools.eyes import Eyes


class TestAuthenticationPages(BaseTest):
    def __init__(self, *args, **kwargs):
        super(TestAuthenticationPages, self).__init__(*args, **kwargs)
        self.__login = LoginPage()
        self.__register = RegisterPage()
        self.__forgot_password = ForgotPasswordPage()

        self.__data = DataGenerateUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()

        self.bot_name = "Test"
        self.invalid_faq = "google.com"
        self.eyes = Eyes()
        self.eyes.api_key = YAML_CONFIG.get("eyes_api_key")

    def setUp(self):
        super().setUp()

    def test_login_page_appearance(self):
        try:
            self.eyes.open(driver=self.__login.driver.core_driver,
                           app_name='sample_app',
                           test_name='Login Page',
                           viewport_size={'width': 1440, 'height': 887})
            self.__login.open_login_page()
            self.__login.wait_for_log_in_page()
            self.eyes.check_window("Default Login Page")
            self.__login.check_remember_me(False)
            self.eyes.check_window("Login Page without remember me")
            self.__login.login_with_account("", "")
            self.eyes.check_window("Login Page with error message")
        finally:
            res = self.eyes.close(raise_ex=True)
            print(res)
            self.eyes.abort_if_not_closed()

    def test_register_page_appearance(self):
        try:
            self.eyes.open(driver=self.__login.driver.core_driver,
                           app_name='sample_app',
                           test_name='Register Page',
                           viewport_size={'width': 1440, 'height': 887})
            self.__register.open_register_page()
            self.__register.wait_for_register_page()
            self.eyes.check_window("Default Register Page")
            self.__register.txt_email.click()
            self.eyes.check_window("Register with tips for email")
            self.__register.txt_password.click()
            self.eyes.check_window("Register with tips for password")
            self.__register.login_with_new_account("", "", "")
            self.eyes.check_window("Register with error message")
        finally:
            res = self.eyes.close(raise_ex=True)
            print(res)
            self.eyes.abort_if_not_closed()

    def test_forgot_password_page_appearance(self):
        try:
            self.eyes.open(driver=self.__login.driver.core_driver,
                           app_name='sample_app',
                           test_name='Forgot Password Page',
                           viewport_size={'width': 1440, 'height': 887})
            self.__forgot_password.open_forgot_password_page()
            self.__forgot_password.wait_for_forgot_password_page()
            self.eyes.check_window("Default Forgot password page")
            self.__forgot_password.submit_email("")
            self.eyes.check_window("Submit empty email")
            self.__forgot_password.submit_email("invalid_email@gmail.com")
            self.eyes.check_window("Submit with wrong email format")
            self.__forgot_password.submit_email(YAML_CONFIG.get("sample_app_user"))
            self.eyes.check_window("Submit successfully")
        finally:
            res = self.eyes.close(raise_ex=True)
            print(res)
            self.eyes.abort_if_not_closed()

    def tearDown(self):
        super().tearDown()

