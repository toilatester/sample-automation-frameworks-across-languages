from selenium.webdriver.common.by import By
from Core.Config.SeleniumDriver.Chrome import Chrome
from Core.Config.SeleniumDriver.Firefox import Firefox
from Core.Config.SeleniumDriver.InternetExplorer import InternetExplorer
from Core.Config.SeleniumDriver.Safari import Safari
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.SeleniumElement.Element import BaseElement
from Core.Config.SeleniumElement.ButtonElement import ButtonElement
from Core.Config.SeleniumElement.InputElement import InputElement
from Core.Config.SeleniumElement.TableElement import TableElement
from Core.Config.SeleniumElement.DropdownElement import ComboBoxElement
from Core.DatabaseFactory.DatabaseQuery.MongoQuery import MongoQuery
from Core.DatabaseFactory.DatabaseQuery.RedisQuery import RedisQuery

from Core.Exceptions.TestContextException import TestContextException
from Config import API_URL, GUI_URL, PROTOCOL, REQUEST_TIMEOUT


class ConstantMeta(type):
    def __call__(cls, *args, **kwargs):
        return cls

    def __getattr__(cls, key):
        return cls[key]

    def __setattr__(cls, key, value):
        """
        not allow set attribute in constant class in case
        access directly to class
        :rtype: object
        """
        raise TestContextException("Cannot set value to Constant variable")


class Constant(metaclass=ConstantMeta):
    API_PROTOCOL = PROTOCOL
    API_HOST = API_URL
    GUI_HOST = GUI_URL
    MONGO_ENGINE_KEY = "mongo_engine_object"
    DRIVER_CREATOR_KEY = "driver_creator"
    WEB_DRIVER_KEY = "web_driver"
    WEB_ELEMENT_CLASS = (SeleniumElement, ButtonElement, ComboBoxElement, TableElement, InputElement, BaseElement)
    WEB_DRIVER_CLASS = (Chrome, Firefox, InternetExplorer, Safari)
    DATABASE_CLASS = (MongoQuery, RedisQuery)
    FINDER_OPTIONS = (
        By.ID, By.NAME, By.CSS_SELECTOR, By.CLASS_NAME, By.XPATH, By.LINK_TEXT, By.PARTIAL_LINK_TEXT, By.TAG_NAME)
    UTF8 = "UTF-8"
    REQUEST_TIMEOUT = REQUEST_TIMEOUT


class TestStatus(metaclass=ConstantMeta):
    (PASS, FAIL, ERROR, SKIP, UNEXPECTED_SUCCESS, EXPECTED_FAIL) = range(1, 7)

    @staticmethod
    def get_status_string_by_id(status_id: int):
        status_string = "Passed"
        if status_id == 1:
            status_string = "PASSED"
        elif status_id == 2:
            status_string = "FAILED"
        elif status_id == 3:
            status_string = "ERROR"
        elif status_id == 4:
            status_string = "SKIPPED"
        elif status_id == 5:
            status_string = "UNEXPECTED SUCCESS"
        elif status_id == 6:
            status_string = "EXPECTED FAIL"
        return status_string

    @staticmethod
    def get_status_id_by_string(status_name: str):
        status_id = 1
        if status_name == "Passed":
            status_id = TestStatus.PASS
        elif status_name == "Failed":
            status_id = TestStatus.FAIL
        elif status_name == "Error":
            status_id = TestStatus.ERROR
        elif status_name == "Skip":
            status_id = TestStatus.SKIP
        elif status_name == "Unexpected Success":
            status_id = TestStatus.UNEXPECTED_SUCCESS
        elif status_name == "Expected Fail":
            status_id = TestStatus.EXPECTED_FAIL
        return status_id
