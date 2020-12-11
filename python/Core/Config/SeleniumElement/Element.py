from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.common.exceptions import NoSuchElementException
from typing import List


class BaseElement(object):

    def __init__(self, element: WebElement):
        self._wrapper_element: WebElement = element
        self.__BASE_TYPE = self.__class__

    def send_keys(self, text_input):
        self._wrapper_element.send_keys(text_input)

    def click(self):
        self._wrapper_element.click()

    def get_element_tag_name(self):
        return self._wrapper_element.tag_name

    def get_element_text(self):
        return self._wrapper_element.text

    def get_element_attribute(self, attribute_key):
        return self._wrapper_element.get_attribute(attribute_key)

    def get_element_css_property(self, property_name):
        return self._wrapper_element.get_property(property_name)

    def is_enable(self):
        return self._wrapper_element.is_enabled()

    def is_selected(self):
        return self._wrapper_element.is_selected()

    def is_displayed(self):
        return self._wrapper_element.is_displayed()

    def find_element(self, by=By.ID, value=None) -> WebElement:
        return self._wrapper_element.find_element(by, value)

    def find_element_if_exist(self, by=By.ID, value=None) -> WebElement or None:
        try:
            ele = self._wrapper_element.find_element(by, value)
            return ele
        except NoSuchElementException:
            return None

    def find_elements(self, by=By.ID, value=None) -> List['WebElement']:
        return self._wrapper_element.find_elements(by, value)

    @property
    def get_wrapper_element(self) -> WebElement:
        return self._wrapper_element
