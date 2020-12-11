from selenium.webdriver.common.by import By
from Core.Base.BaseComponent import BaseComponent
from Core.Config.SeleniumElement.Element import BaseElement


class DropDownList(BaseComponent):
    def __init__(self):
        BaseComponent.__init__(self, By.ID, "bots-list-dropdown")

    def select_bot(self, bot_name=None):
        # TODO(namndoan): Complete the selection
        if bot_name is None:
            self.base_component_element(BaseElement).click()

    def current_bot_info(self):
        current_bot = self.get_child_element(BaseElement,
                                             By.CSS_SELECTOR,
                                             "div:nth-child(1)")
        fullname = current_bot.text
        return fullname

    def get_expected_full_name(self, bot_name, website):
        return "{} ‘{}’".format(bot_name, website)

    def open_dropdown_list(self):
        pass

    def close_dropdown_list(self):
        pass

    def get_list_bots(self):
        pass
