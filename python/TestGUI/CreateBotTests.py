from Core.Base.BaseTest import BaseTest
from Core.Config.DriverFactory import DriverFactory
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.Component.DropDownList import DropDownList
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from Data.GUI import INVALID_BOT_INFO_DATA
from Config import YAML_CONFIG
import unittest


class CreateBotFeatureTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(CreateBotFeatureTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__appearance = AppearancePage()
        self.__create_bot_validation = CreateBotValidation()
        self.__drop_down_list = DropDownList()
        self.__data_set = DataUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.faq_url = YAML_CONFIG.get("stub_faq_url")

    def setUp(self):
        super().setUp()
        self.__register.open_register_page()
        self.__register.login_with_new_account(self.valid_username,
                                               self.valid_email,
                                               self.valid_password)
        self.__create_bot.wait_for_create_page()

    def test_create_bot_unsuccessfully_with_invalid_inputs(self):
        bot_infos = self.__data_set.get_data(INVALID_BOT_INFO_DATA)
        expected_errors = [bot_info[2] for bot_info in bot_infos[1:]]
        actual_errors = []
        for bot_info in bot_infos[1:]:
            bot_name = bot_info[0]
            bot_url = bot_info[1]
            self.__create_bot.open_create_page()
            self.__create_bot.create_bot_with_data(bot_name, bot_url)
            actual_errors.append(self.__create_bot.lbl_error_message.get_element_text())
        self.assertEqual(expected_errors, actual_errors)

    @unittest.skip("Update logic with ignore for offline network")
    def test_create_bot_unsuccessfully_with_offline_connection(self):
        DriverFactory.get_driver().core_driver.set_network_conditions(offline=True, latency=5, throughput=500 * 1024)
        self.__create_bot.open_create_page()
        self.__create_bot.create_bot_with_data('Random Name', 'www.katalon.com')
        self.assertEqual(self.__create_bot.lbl_error_message.get_element_text(), 'Failed to fetch')

    def test_create_bot_successfully(self):
        bot_name = "Bot_name"
        website = self.faq_url
        self.__create_bot.open_create_page()
        self.__create_bot.create_bot_with_data(bot_name, website)
        print(self.__appearance.get_header_title_text())
        print(self.__appearance.get_expected_title(bot_name=bot_name))
        assert self.__appearance.get_header_title_text() == self.__appearance.get_expected_title(bot_name=bot_name)
        self.__create_bot_validation.wait_and_verify_notification_message()
        self.__create_bot_validation.should_init_correct_total_faq_questions(self.valid_email, bot_name)
        self.__create_bot_validation.should_init_correct_question_data()

    def test_create_bot_with_existed_bot_name_successfully(self):
        new_bot_name = "Bot_name"
        new_bot_website = "www.google.com"
        # Create a bot
        self.test_create_bot_successfully()
        # Open create bot page again
        self.__create_bot.open_create_page()
        self.__create_bot.create_bot_with_data(new_bot_name, new_bot_website)
        # Verify that new bot name is displayed
        self.__create_bot_validation.new_bot_should_be_current_selected_bot(new_bot_name, new_bot_website)
        self.__create_bot_validation.wait_and_verify_notification_message()
        self.__create_bot_validation.should_init_correct_total_faq_questions(self.valid_email, new_bot_name)
        self.__create_bot_validation.should_init_correct_question_data()

    def test_create_bot_with_existed_website_successfully(self):
        new_bot_name = "Another name"
        new_bot_website = self.faq_url
        # Create a bot
        self.test_create_bot_successfully()
        # Open create bot page again
        self.__create_bot.open_create_page()
        self.__create_bot.create_bot_with_data(new_bot_name, new_bot_website)
        # Verify that new bot name is displayed
        self.__create_bot_validation.new_bot_should_be_current_selected_bot(new_bot_name, new_bot_website)
        self.__create_bot_validation.wait_and_verify_notification_message()
        self.__create_bot_validation.should_init_correct_total_faq_questions(self.valid_email, new_bot_name)
        self.__create_bot_validation.should_init_correct_question_data()

