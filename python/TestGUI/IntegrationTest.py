from Core.Base.BaseTest import BaseTest
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.POM.IntegrationPage.IntegrationPage import IntegrationPage
from GUI.POM.Dashboard.DashboardPage import DashboardPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Core.Exceptions.TestContextException import TestContextException
from Utils.FileUtils import HTMLFileUtils
from GUI.Component.ClientSimulator import ClientSimulator
from GUI.POM.Conversation.ConversationPage import ConversationPage
import time


class IntegrationTest(BaseTest):
    greeting_message = "Hello"
    greeting_responses = [
        "Good day, mate! How can I help you?",
        "How are you today? Ask me if you need to find out anything.",
        "Nice to meet you. Let me help you today.",
        "Hi, just ask me everything you want to know."
    ]

    def __init__(self, *args, **kwargs):
        super(IntegrationTest, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__login = LoginPage()
        self.__appearance = AppearancePage()
        self.__integration = IntegrationPage()
        self.__dashboard = DashboardPage()
        self.__create_bot_validation = CreateBotValidation()
        self.__html_file = HTMLFileUtils()
        self.__client_simulator = ClientSimulator()
        self.__conversation = ConversationPage()
        self.integrated_page_path = ""

    def setUp(self):
        super().setUp()
        try:
            self.sign_in_for_ui_test(is_debugging=False)
            # Go to Integration Page
            self.__integration.open_integration_page()
            # Copy script
            script = self.__integration.get_script()
            # Store into test.html file and set the path to integrated web page
            html_file_path = self.__html_file.create_html_file_with_injected_script("test.html", script)
            self.integrated_page_path = "file://{}".format(html_file_path)

        except Exception as e:
            super().tearDown()
            raise TestContextException(e)

    def test_integrate_with_website_successfully(self):
        main_window_handle = self.get_current_window_handle()

        # Open new tab with integrated page url
        self.open_new_tab(self.integrated_page_path)
        time.sleep(3)
        # Chat and verify response message in integrated web page
        actual_response = self.chat_and_get_response(self.greeting_message)
        assert actual_response in self.greeting_responses, \
            f"Message '{actual_response}' is not in Welcome messages"

        # Verify message sent in integrated web page is displayed in conversation history
        self.switch_to_window(main_window_handle)
        last_message = self.get_last_message_in_conversation_history()
        assert last_message == self.greeting_message, \
            f"Last message in conversation history is not the same with replied one" \
            f"expected {self.greeting_message} but {last_message} is found"

    def get_current_window_handle(self):
        return self.__integration.driver.core_driver.current_window_handle

    def switch_to_window(self, window_handle):
        self.__integration.driver.core_driver.switch_to.window(window_handle)

    def open_new_tab(self, url):
        driver = self.__integration.driver.core_driver
        # Open new tab
        driver.execute_script('''window.open("http://bings.com","_blank");''')
        # Open html file in new tab
        driver.switch_to.window(driver.window_handles[1])
        driver.get(url)

    def chat_and_get_response(self, message):
        self.__client_simulator.send_message(message)
        # Sleep to wait for response
        time.sleep(10)
        responses = self.__client_simulator.get_responses()
        # Last message in list response
        actual_response = responses[-1]
        return actual_response

    def get_last_message_in_conversation_history(self):
        self.__conversation.open_conversation_page()
        # Wait for loading page
        time.sleep(3)
        return self.__conversation.get_last_message()
