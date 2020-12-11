from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement, BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from Core.DatabaseFactory.DatabaseType import DatabaseType
from GUI.Component.LoaderComponent import LoaderComponent
from Utils.DatabaseUtils import DatabaseHelper


class CreateBotPage(BasePage):
    timeout = 10
    path_page = "/admin/manage_account/create_bot"
    txt_website_url = ElementFactory.get_element_until(by=By.ID, locator="website-input",
                                                       wait_type=EC.visibility_of_element_located,
                                                       element_cls=SeleniumElement)
    txt_bot_name = ElementFactory.get_element_until(by=By.ID, locator="chatbot-name-input",
                                                    wait_type=EC.visibility_of_element_located,
                                                    element_cls=SeleniumElement)
    btn_create_bot = ElementFactory.get_element_until(by=By.ID, locator="create-button",
                                                      wait_type=EC.visibility_of_element_located,
                                                      element_cls=SeleniumElement)

    lbl_error_message = ElementFactory.get_element(by=By.XPATH, locator="//button[@id='create-button']/../span",
                                                   element_cls=SeleniumElement)
    # Should move to common page object
    txt_bottom_left_noti = ElementFactory.get_element(
        by=By.CSS_SELECTOR,
        locator="#root div.notifications-wrapper div.notification-message",
        element_cls=SeleniumElement
    )

    txt_header = ElementFactory.get_element_until(
        by=By.CSS_SELECTOR, locator="h2.header",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    def __init__(self):
        self.__db_helper = DatabaseHelper(DatabaseType.MONGO_DB).database_query
        self.__loader_component = LoaderComponent()

    @property
    def txt_header_text(self):
        return "Create your virtual assistant"

    def get_header_text(self) -> str:
        return self.txt_header.get_element_text()

    def open_create_page(self):
        self.open_page(self.path_page)

    def create_bot_with_data(self, bot_name, website_url):
        self.input_bot_info_with_data(bot_name, website_url)
        self.click_create_bot_button()
        self.__loader_component.wait_for_component_invisible(60)

    def input_bot_info_with_data(self, bot_name, website_url):
        self.txt_bot_name.send_keys(bot_name)
        self.txt_website_url.send_keys(website_url)

    def click_create_bot_button(self):
        self.btn_create_bot.click()

    def wait_for_create_page(self):
        self.wait_for_page(self.path_page, self.timeout)

    def get_bot_data_via_user_email(self, user_email):
        return self.__db_helper.get_item_in_collection("Bot", {"creators.0.email": user_email})

    def get_bot_data_via_user_email_and_bot_name(self, user_email, bot_name):
        return self.__db_helper.get_item_in_collection("Bot", {"creators.0.email": user_email, "name": bot_name})

    def get_list_question_via_bot_id(self, bot_id):
        return self.__db_helper.get_list_item_in_collection("Qna", {"botId": bot_id})
