from Core.Base.BaseTest import BaseTest
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage.CreateBotPage import CreateBotPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from Data.GUI import INVALID_REGISTER_DATA


class RegisterFeatureTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(RegisterFeatureTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__register = RegisterPage()
        self.__create_bot = CreateBotPage()
        self.__data_set = DataUtils()
        self.valid_name = self.__data.create_name()
        self.valid_email = self.__data.create_email()
        self.valid_password = self.__data.create_password()

    def test_register_new_account_successful(self):
        self.__register.open_register_page()
        self.__register.login_with_new_account(self.valid_name,
                                               self.valid_email,
                                               self.valid_password)
        self.__create_bot.wait_for_create_page()
        self.assertTrue(self.__create_bot.txt_header_text.lower() in self.__create_bot.get_header_text().lower(),
                        "Expect header '{0}' but '{1}' found".format(self.__create_bot.txt_header_text,
                                                                     self.__create_bot.get_header_text()))
        self.assertTrue(self.__create_bot.path_page in self.__register.driver.current_url,
                        "Current page url {0}".format(self.__register.driver.current_url))

    def test_register_new_account_unsuccessful_with_invalid_inputs(self):
        accounts = self.__data_set.get_data(INVALID_REGISTER_DATA)
        expected_errors = [account[3] for account in accounts[1:]]
        errors = []
        for account in accounts[1:]:
            fullname = account[0]
            email = account[1]
            password = account[2]
            self.__register.open_register_page()
            self.__register.login_with_new_account(fullname,
                                                   email,
                                                   password)
            errors.append(self.__register.lbl_error_message.get_element_text())
        self.assertEqual(expected_errors, errors,
                         "Assert Error : {0} != {1}".format(expected_errors, errors))
        self.assertTrue(self.__register.txt_header_text.lower() in self.__register.driver.page_source.lower(),
                        "'{0}' does not present in DOM".format(self.__register.txt_header_text))
        self.assertTrue(self.__register.path_page in self.__register.driver.current_url,
                        "{0} is not included in url".format(self.__register.path_page))
