from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.remote.webelement import By, WebElement
from selenium.webdriver.support.wait import WebDriverWait, NoSuchElementException
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.common.exceptions import StaleElementReferenceException
from Core.Config.SeleniumDriver.Driver import SeleniumDriver
from Core.Config.SeleniumElement import BaseElement
from Core.Config.DriverFactory import DriverFactory
from Core.Config.Service.ElementFinder import ElementFactory
from Core.Exceptions.TestContextException import TestContextException
from typing import TypeVar, List
import time

T = TypeVar('T')


class BaseComponent(object):

    def __init__(self, locator_type: By, base_component_locator_value: str):
        self.__base_locator = (locator_type, base_component_locator_value)

    @property
    def base_component_locator(self):
        return self.__base_locator

    @property
    def driver(self) -> SeleniumDriver:
        return DriverFactory.get_driver()

    def base_component_list_element(self, ele_class: T) -> List['T']:
        '''
        Because lazy initial finding we need to
        call __get__ method for finding element
        :param ele_class:
        :return: List of WebElement base on element class
        '''
        base_element = ElementFactory.get_list_element(ele_class, self.base_component_locator[0],
                                                       self.base_component_locator[1])
        base_element()
        return base_element

    def base_component_element(self, ele_class: T) -> T:
        '''
        Because lazy initial finding we need to
        call __get__ method for finding element
        :param ele_class:
        :return: WebElement base on element class
        '''
        base_element = ElementFactory.get_element(ele_class, self.base_component_locator[0],
                                                  self.base_component_locator[1])
        base_element()
        return base_element

    def wait_for_component_visible(self, time_out=30):
        try:
            WebDriverWait(self.driver.core_driver, time_out).until(
                ec.element_to_be_clickable(self.base_component_locator))
        except TimeoutException:
            raise TestContextException("Loading this page took too much time after waiting {}s".format(time_out))

    def wait_for_component_invisible(self, time_out=30):
        try:
            WebDriverWait(self.driver.core_driver, time_out).until(
                ec.invisibility_of_element_located(self.base_component_locator))
        except TimeoutException:
            raise TestContextException("Loading this page took too much time after waiting {}s".format(time_out))

    def wait_for_component_remove(self, time_out=30):
        try:
            WebDriverWait(self.driver.core_driver, time_out).until(
                self.__check_element_remove)
        except TimeoutException:
            raise TestContextException("Remove this component took too much time after waiting {}s".format(time_out))

    def wait_for_child_element_has_present(self, locator_type, locator_value, time_out=30, polling_time=0.5):
        try:
            self.__check_child_elements_append((locator_type, locator_value), time_out, polling_time)
        except TimeoutException:
            raise TestContextException(
                "Child element append this component took too much time after waiting {}s".format(time_out))

    def get_child_element(self, ele_class: T, locator_type, locator_value) -> WebElement:
        base_element = self.base_component_element(ele_class)
        child_element = base_element.find_element(locator_type, locator_value)
        return child_element

    def get_child_element_if_exist(self, locator_type, locator_value, parent_element) -> WebElement or None:

        try:
            return parent_element.find_element(locator_type, locator_value)
        except WebDriverException:
            return None

    def get_list_child_element(self, ele_class: T, locator_type, locator_value) -> List['WebElement']:
        base_element = self.base_component_element(ele_class)
        list_child_element = base_element.find_elements(locator_type, locator_value)
        return list_child_element

    def get_list_child_element_in_list_component(self, ele_class: T, locator_type, locator_value) -> List['WebElement']:
        base_element = self.base_component_list_element(ele_class)
        list_element = []
        for element in base_element:
            list_element.extend(element.find_elements(locator_type, locator_value))
        return list_element

    def __check_element_remove(self, driver: WebDriver):
        try:
            driver.find_element(self.base_component_locator[0],
                                self.base_component_locator[1])
            return False
        except NoSuchElementException:
            return True

    def __check_child_elements_append(self, child_locator, time_out, polling_time):

        screen = None
        stacktrace = None

        end_time = time.time() + time_out
        while True:
            try:
                base_element: BaseElement = self.base_component_element(BaseElement)
                value = base_element.find_elements(child_locator[0],
                                                   child_locator[1])
                if value:
                    return len(value) > 0
            except (StaleElementReferenceException, NoSuchElementException) as exc:
                screen = getattr(exc, 'screen', None)
                stacktrace = getattr(exc, 'stacktrace', None)
            time.sleep(polling_time)
            if time.time() > end_time:
                break
        raise TimeoutException("Timeout for wait child element append", screen, stacktrace)
