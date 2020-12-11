import json

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement.Element import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from Utils.LocalStorage import LocalStorage


class ChatBoxSimulator(BasePage):
    path_page = "/admin/setting_bot/appearance"
    btn_drop_down_list = ElementFactory.get_element_until(by=By.ID, locator="dropDownListBotTriggerButton",
                                                          wait_type=EC.visibility_of_element_located,
                                                          element_cls=BaseElement)
    txt_input_message = ElementFactory.get_element_until(by=By.ID, locator="inputmessage",
                                                         wait_type=EC.visibility_of_element_located,
                                                         element_cls=BaseElement)
    btn_send_message = ElementFactory.get_element_until(by=By.XPATH,
                                                        locator="//textarea[contains(@id,'inputmessage')]"
                                                                "/following-sibling::span[1]/*",
                                                        wait_type=EC.visibility_of_element_located,
                                                        element_cls=BaseElement)

    def open_configure_appearance_page(self):
        self.open_page(self.path_page)

    def send_message(self, message):
        self.txt_input_message.send_keys(message)
        self.txt_input_message.send_keys(Keys.RETURN)

    def get_result(self, messages):
        result = messages
        response = self.get_responses_list()
        for i in range(1, len(messages)):
            result[i].append(response[i][0])
        return result

    def get_responses_list(self):
        responses_list = []
        conversation = self.get_conversation()
        messages_data = json.loads(conversation)['chatbox']
        for message in messages_data['messages']:
            if not message['isUser']:
                responses_list.append([message['data']])
        return responses_list[0:]

    def get_conversation(self):
        storage = LocalStorage(self.driver)
        return storage.get('state')

    def clear_conversation(self):
        storage = LocalStorage(self.driver)
        storage.remove
