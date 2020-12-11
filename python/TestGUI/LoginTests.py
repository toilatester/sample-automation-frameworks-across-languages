from Core.Base.BaseTest import BaseTest
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage.CreateBotPage import CreateBotPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from Data.GUI import INVALID_LOGIN_DATA


class LoginFeatureTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(LoginFeatureTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__data_set = DataUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()

    def test_login_unsuccessfully_due_to_blank_fields(self):
        accounts = self.__data_set.get_data(INVALID_LOGIN_DATA)
        expected_errors = [account[2] for account in accounts[1:]]
        actual_errors = []
        for account in accounts[1:]:
            email = account[0]
            password = account[1]
            self.__login.open_login_page()
            self.__login.login_with_account(email,
                                            password)
            actual_errors.append(self.__login.lbl_error_message.get_element_text())
        self.assertEqual(expected_errors, actual_errors,
                         "Assert Error : {0} != {1}".format(expected_errors, actual_errors))
        self.assertTrue(self.__login.txt_header_text.lower() in self.__login.driver.page_source.lower(),
                        "'{0}' text does not present in DOM".format(self.__login.txt_header_text))
        self.assertTrue(self.__login.path_page in self.__login.driver.current_url,
                        "{0} is not included in url".format(self.__login.path_page))