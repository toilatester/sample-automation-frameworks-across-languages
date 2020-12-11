from Core.Base.BaseTest import BaseTest
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.POM.IntegrationPage import IntegrationPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Config import YAML_CONFIG
from Utils.FileUtils import HTMLFileUtils
from GUI.Component.ClientSimulator import ClientSimulator
from GUI.POM.Conversation.ConversationPage import ConversationPage
import os
import time


class TestConversationDuration(BaseTest):
    def __init__(self, *args, **kwargs):
        super(TestConversationDuration, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__appearance = AppearancePage()
        self.__integration = IntegrationPage()
        self.__create_bot_validation = CreateBotValidation()
        self.__html_file = HTMLFileUtils()
        self.__client_simulator = ClientSimulator()
        self.__conversation = ConversationPage()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.bot_name = self.__data.create_uuid_number()
        self.invalid_faq = YAML_CONFIG.get("stub_invalid_faq_url")
        self.integrated_page_path = ""
        self.root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.file_path = os.path.normpath(os.path.join(self.root_path, 'TestGUI', 'index.html'))

    def setUp(self):
        # TODO(namndoan): Register a new account and create integrated html file
        # Currently, I used exist account for manual check
        pass

    def test_duration(self):
        # TODO(namndoan): Random a list of duration time then create conversation
        self.create_conversation_chatting_in__minutes(150)
        time.sleep(10)
        self.__client_simulator.send_message("Thanks")
        time.sleep(10)
        self.__client_simulator.send_message("It's great")
        time.sleep(60)
        self.chat_continuously_in(60)
        # self.__client_simulator.send_message("Last message after 230 secs")
        # self.clear_storage()
        # self.create_conversation_chatting_in__minutes(150)
        # self.clear_storage()
        # self.create_conversation_chatting_in__minutes(200)
        # self.clear_storage()
        # TODO(namndoan): Get duration info from admin page and assert
        # Currently, I checked duration manually

    def create_conversation_chatting_in__minutes(self, duration: int):
        # Open integrated web
        self.__integration.driver.core_driver.get(self.file_path)

        print("Duration: {}".format(duration))
        timestamp = 0
        # Chat
        self.__client_simulator.send_message("First message")
        print("Timestamp: {}".format(timestamp))
        while timestamp < duration:
            wait_time = 30
            if duration - timestamp < 30:
                wait_time = duration - timestamp
            print("Wait time: {}".format(wait_time))
            time.sleep(wait_time)
            timestamp += wait_time
            print("Timestamp: {}".format(timestamp))
            self.__client_simulator.send_message("Message after {} secs".format(timestamp))

    def chat_continuously_in(self, duration):
        print("Duration: {}".format(duration))
        timestamp = 0
        # Chat
        self.__client_simulator.send_message("First message")
        print("Timestamp: {}".format(timestamp))
        while timestamp < duration:
            wait_time = 30
            if duration - timestamp < 30:
                wait_time = duration - timestamp
            print("Wait time: {}".format(wait_time))
            time.sleep(wait_time)
            timestamp += wait_time
            print("Timestamp: {}".format(timestamp))
            self.__client_simulator.send_message("Message after {} secs".format(timestamp))

    def clear_storage(self):
        self.__client_simulator.driver.core_driver.delete_all_cookies()
        self.__client_simulator.driver.core_driver.execute_script("localStorage.clear()")
        self.__client_simulator.driver.core_driver.execute_script("sessionStorage.clear()")
