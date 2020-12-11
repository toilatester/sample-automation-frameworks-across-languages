from robot.libraries.BuiltIn import BuiltIn
from SeleniumLibrary import SeleniumLibrary, AlertKeywords, BrowserManagementKeywords, CookieKeywords, ElementKeywords, \
    FormElementKeywords, FrameKeywords, JavaScriptKeywords, RunOnFailureKeywords, SelectElementKeywords, \
    ScreenshotKeywords, TableElementKeywords, WaitingKeywords, WindowKeywords
from typing import Union

TYPE_HINT = Union[
    SeleniumLibrary, AlertKeywords, BrowserManagementKeywords, CookieKeywords,
    ElementKeywords, FormElementKeywords, FrameKeywords, JavaScriptKeywords,
    RunOnFailureKeywords, SelectElementKeywords, ScreenshotKeywords, TableElementKeywords,
    WaitingKeywords, WindowKeywords]


class BaseObject(object):
    def __init__(self):
        self.robot_built_in: BuiltIn = BuiltIn()
        self.selenium: TYPE_HINT = self.robot_built_in.get_library_instance("SeleniumLibrary")
        self.robot_built_in.set_global_variable("${GLOBAL_VARIABLE_NAME}", "PUT YOUR VALUE HERE")
        self.robot_built_in.set_suite_variable("${GLOBAL_VARIABLE_NAME}", "PUT YOUR VALUE HERE")
        self.robot_built_in.set_test_variable("${GLOBAL_VARIABLE_NAME}", "PUT YOUR VALUE HERE")
        self.robot_built_in.log_to_console("Log to console for debugging")
        self.__do_some_thing_with_robot_variable(
            self.robot_built_in.get_variable_value("${VARIABLE_NAME}", "DefaultValue"))

    def __do_some_thing_with_robot_variable(self, value):
        pass
