from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.firefox.options import Options

from .Driver import SeleniumDriver


class Firefox(SeleniumDriver):
    def __init__(self):
        super().__init__()

    def create_driver(self):
        if self._driver is None:
            self._driver = webdriver.Firefox(capabilities=None, firefox_options=None)

    def set_driver_desired_capabilities(self, desired_capabilities):
        if isinstance(desired_capabilities, DesiredCapabilities):
            self.capabilities = desired_capabilities

    def set_driver_options(self, options):
        if isinstance(options, Options):
            self.options = options

    __module__ = "firefox"
