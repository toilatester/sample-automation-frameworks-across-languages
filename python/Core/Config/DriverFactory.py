__author__ = 'hnminh@outlook.com'
import os
from Core.Config.Settings import Settings
from Core.Helper.Constant import Constant
from Core.Helper.Singleton import Singleton
from Core.Config.SeleniumDriver.Driver import SeleniumDriver


class DriverFactory(metaclass=Singleton):
    """
    Use Singleton with staticmethod for user can easy invoke method
    """
    __driver_creator = None

    @staticmethod
    def set_driver_options(options):
        DriverFactory.__driver_creator.set_driver_options(options)

    @staticmethod
    def set_driver_capabilities(capabilities):
        DriverFactory.__driver_creator.set_driver_desired_capabilities(capabilities)

    @staticmethod
    def create_driver():
        DriverFactory.get_driver_creator_class()
        Settings.THREAD_LOCAL.driver_creator.create_driver()

    @staticmethod
    def get_driver() -> SeleniumDriver:
        """
        Returns: SeleniumDriver

        """
        if getattr(Settings.THREAD_LOCAL, Constant.WEB_DRIVER_KEY, None) is None:
            DriverFactory.create_driver()
        return getattr(Settings.THREAD_LOCAL, Constant.DRIVER_CREATOR_KEY)

    @staticmethod
    def dispose_driver():
        if getattr(Settings.THREAD_LOCAL, Constant.DRIVER_CREATOR_KEY, None) is not None:
            Settings.THREAD_LOCAL.driver_creator.dispose_driver()

    @staticmethod
    def get_driver_creator_class():
        if getattr(Settings.THREAD_LOCAL, Constant.DRIVER_CREATOR_KEY, None) is None:
            for driver_creator in Constant.WEB_DRIVER_CLASS:
                if DriverFactory.get_browser_running() in driver_creator.__module__:
                    Settings.THREAD_LOCAL.driver_creator = driver_creator()

    @staticmethod
    def get_browser_running():
        return os.environ.get('browser', 'chrome')
