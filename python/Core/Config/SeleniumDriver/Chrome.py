from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from Core.Config.SeleniumDriver.Driver import SeleniumDriver


class Chrome(SeleniumDriver):
    def __init__(self):
        super().__init__()

    def create_driver(self):
        if self._driver is None:
            self._driver = webdriver.Chrome(chrome_options=self.options, desired_capabilities=self.capabilities)

    def set_driver_desired_capabilities(self, desired_capabilities):
        if isinstance(desired_capabilities, DesiredCapabilities):
            self.capabilities = desired_capabilities

    def set_driver_options(self, options):
        if isinstance(options, Options):
            self.options = options

    __module__ = "chrome"
