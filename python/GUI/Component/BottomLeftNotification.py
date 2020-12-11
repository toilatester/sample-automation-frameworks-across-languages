from Core.Base.BaseComponent import BaseComponent, By, BaseElement
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located


class BottomLeftNotification(BaseComponent):
    def __init__(self):
        BaseComponent.__init__(self, By.CSS_SELECTOR, "#root div.notifications-wrapper div.notification-message")

    def get_message(self):
        return self.base_component_element(ele_class=BaseElement).get_element_text()

    def wait_for_component_present(self, time_out=30):
        WebDriverWait(self.driver.core_driver, time_out).until(presence_of_element_located(self.base_component_locator))