from Core.Base import BaseTest
from Core.Exceptions.TestContextException import TestContextException
from GUI.Component import ClientSimulator
from GUI.POM.IntegrationPage import IntegrationPage
from Utils.FileUtils import HTMLFileUtils


class BaseIntegrationTest(BaseTest):
    API_PAY_LOAD = []
    GUI_SCREEN_SHOT = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__integration = IntegrationPage()
        self.__html_file = HTMLFileUtils()
        self._client_simulator = ClientSimulator()

    def set_up_website_integration(self):
        try:
            self.sign_in_for_ui_test(is_debugging=True)
            # Go to Integration Page
            self.__integration.open_integration_page()
            # Copy script
            script = self.__integration.get_script()
            # Store into test.html file and set the path to integrated web page
            html_file_path = self.__html_file.create_html_file_with_injected_script("integration.html", script)
            # Go to integrated page
            self.__integration.driver.get("file:///{}".format(html_file_path))
            self._client_simulator.wait_for_component_visible(10)
        except Exception as e:
            raise TestContextException(e)
