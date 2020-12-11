from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait
from Core.Config.SeleniumDriver.Driver import SeleniumDriver
from Core.Config.DriverFactory import DriverFactory
from Core.Config.Settings import Settings
from Core.Exceptions.TestContextException import TestContextException


class BasePage(object):
    @property
    def driver(self) -> SeleniumDriver:
        return DriverFactory.get_driver()

    def open_page(self, path):
        path = path if str(path).startswith("/") else "/" + path
        self.driver.get(Settings.BASE_URL + path)

    def wait_for_page(self, path, timeout):
        try:
            WebDriverWait(self.driver.core_driver, timeout).until(
                ec.url_contains(path))
        except TimeoutException:
            raise TestContextException("Loading this page took too much time after waiting {}s".format(timeout))
