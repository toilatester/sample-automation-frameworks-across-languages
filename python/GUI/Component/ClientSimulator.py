from selenium.common.exceptions import TimeoutException
from selenium.webdriver import ActionChains
from selenium.webdriver.remote.webdriver import By
from selenium.webdriver.support import expected_conditions as EC

from Core.Base.BaseComponent import BaseComponent
from Core.Config.SeleniumElement.Element import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory


class ClientSimulator(BaseComponent):
    txt_feedback_title_locator = "//*[contains(@class, 'feedbackContainer')]/div[contains(@class, 'title')]"

    ico_open_bot = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="//div[contains(@class, 'minimizedBoxContainer')]",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    chat_box = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="//div[contains(@class, 'chatboxContainer')]",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    ico_close_bot = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="//div[contains(@class, 'chatboxContainer')]//div[contains(@class, 'minimizeIcon')]",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    txb_message = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="//div[contains(@class, 'chatboxContainer')]//textarea",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    list_txt_response = ElementFactory.get_list_element(
        by=By.XPATH,
        locator="//div[contains(@class,'messageContainerLeft')]//div[contains(@class,'messageTextLeft')]",
        element_cls=BaseElement
    )

    ifr_sample_app_chatbox = ElementFactory.get_element_until(
        by=By.CSS_SELECTOR,
        locator="#sample_app-minimized-box-frame",
        element_cls=BaseElement,
        wait_type=EC.visibility_of_element_located
    )

    ifr_chat_box = ElementFactory.get_element_until(
        by=By.ID, locator="sample_app-chatbox-frame",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    txt_feedback_title = ElementFactory.get_element_until(
        by=By.XPATH, locator=txt_feedback_title_locator,
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    list_feedback_icon = ElementFactory.get_list_element(
        by=By.XPATH,
        locator="//*[contains(@class, 'feedbackContainer')]/div[contains(@class, 'ratingIconsContainer')]/*",
        element_cls=BaseElement
    )

    txt_latest_response = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="(//*[contains(@class, 'styles__messageTextRight')])[last()]"
                "/../../../following-sibling::div[1]//*[contains(@class, 'styles__messageTextLeft')]",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    btn_send_msg = ElementFactory.get_element_until(
        by=By.XPATH,
        locator="//div[contains(@class, 'chatboxContainer')]//textarea/../../following-sibling::button",
        wait_type=EC.visibility_of_element_located,
        element_cls=BaseElement
    )

    def __init__(self):
        BaseComponent.__init__(self, By.ID, "sample_app-chatbox")

    def open_chat_box(self):
        self.click_on_chatbot_icon()

    def close_chat_box(self):
        self.click_on_chatbot_icon()

    def click_on_chatbot_icon(self):
        self.driver.core_driver.switch_to.frame(self.ifr_sample_app_chatbox.get_wrapper_element)
        self.ico_open_bot.click()
        self.driver.core_driver.switch_to.parent_frame()

    def is_open(self):
        try:
            is_open = self.ifr_chat_box.is_displayed()
        except TimeoutException:
            is_open = False
        return is_open

    def send_message(self, message):
        if not self.is_open():
            self.open_chat_box()
        self._switch_to_chat_frame()
        self.txb_message.send_keys(message)
        self.btn_send_msg.click()
        self._switch_to_parent_frame()

    def get_responses(self):
        self._switch_to_chat_frame()
        responses = list(map(lambda elem: elem.get_element_attribute("innerText"), self.list_txt_response))
        self._switch_to_parent_frame()
        return responses

    def create_stub_messages(self, message, quantity=1):
        self.open_chat_box()
        self._switch_to_chat_frame()
        for i in range(quantity):
            self.txb_message.send_keys(message + " " + str(i))
            self.btn_send_msg.click()
            self.wait_for_response()
        self._switch_to_parent_frame()

    def wait_for_feedback_returned(self):
        self._switch_to_chat_frame()
        try:
            is_visible = self.txt_feedback_title.is_displayed()
        except TimeoutException:
            is_visible = False
        self._switch_to_parent_frame()
        return is_visible

    def wait_for_response(self):
        # Trigger wait method after each message is sent by calling the element
        return self.txt_latest_response

    def get_feedback_title(self):
        self._switch_to_chat_frame()
        text = self.txt_feedback_title.get_element_text()
        self._switch_to_parent_frame()
        return text

    def get_list_feedback_text(self):
        feedback_text = []
        self._switch_to_chat_frame()
        for element in self.list_feedback_icon:
            action = ActionChains(self.driver.core_driver).move_to_element(element.get_wrapper_element)
            action.perform()
            # Relocated element due to change in DOM
            ele = self.driver.core_driver.find_element_by_xpath(self.txt_feedback_title_locator)
            feedback_text.append(ele.text)
        self._switch_to_parent_frame()
        return feedback_text

    def _switch_to_chat_frame(self):
        self.driver.core_driver.switch_to.frame(self.ifr_chat_box.get_wrapper_element)

    def _switch_to_parent_frame(self):
        self.driver.core_driver.switch_to.parent_frame()

    def open_wait_close(self):
        pass

    def get_bot_avatar_source(self):
        self._switch_to_chat_frame()
        result = self.driver.core_driver.find_element_by_xpath("//img").get_attribute("src")
        self._switch_to_parent_frame()
        return result
