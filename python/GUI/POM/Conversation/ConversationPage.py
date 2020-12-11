from selenium.webdriver.common.by import By
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from GUI.Component.LoaderComponent import LoaderComponent


class ConversationPage(BasePage):
    path_page = "/admin/conversations"
    list_conversations_container = ElementFactory.get_list_element(
        by=By.XPATH,
        locator="//*[contains(@class, 'list') and contains(@class,'conversations')]//*[contains(@class,'item')]",
        element_cls=BaseElement
    )

    def __init__(self):
        self.__loader_component = LoaderComponent()

    def open_conversation_page(self):
        self.open_page(path=self.path_page)

    def get_last_message(self, conversation_index=0):
        self.__loader_component.wait_for_component_invisible()
        txt_last_message = self.list_conversations_container[conversation_index].find_element(
            by=By.TAG_NAME,
            value="abbr",
        )
        return txt_last_message.text
