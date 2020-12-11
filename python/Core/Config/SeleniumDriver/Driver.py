from selenium.webdriver.remote.webdriver import WebDriver


class SeleniumDriver(object):
    def __init__(self):
        self.__options = None
        self.__capabilities = None
        self._driver: WebDriver = None

    def create_driver(self):
        pass

    @property
    def options(self):
        return self.__options

    @options.setter
    def options(self, options):
        self.__options = options

    @property
    def capabilities(self):
        return self.__capabilities

    @capabilities.setter
    def capabilities(self, capabilities):
        self.__capabilities = capabilities

    @property
    def core_driver(self) -> WebDriver:
        # Create driver if user forget create driver via DriverFactory
        if self._driver is None:
            from Core.Config.DriverFactory import DriverFactory
            DriverFactory.create_driver()
        return self._driver

    @property
    def page_source(self):
        return self.core_driver.page_source

    @property
    def current_url(self):
        return self.core_driver.current_url

    def dispose_driver(self):
        if self._driver is not None:
            self.core_driver.quit()
            self._driver = None

    def maximize_browser(self):
        self.core_driver.maximize_window()

    def get(self, url):
        self._driver.get(url)

    def quit(self):
        self._driver.quit()

    def close(self):
        self._driver.close()
