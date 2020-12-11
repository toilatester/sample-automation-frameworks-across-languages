from selenium.webdriver.common.by import By
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement.Element import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from selenium.webdriver.support import expected_conditions as EC


class IntegrationPage(BasePage):
    path_page = "/admin/setting_bot/integration"

    txb_script = ElementFactory.get_element_until(by=By.XPATH,
                                                  locator="//*[@id='copy-button']/../following-sibling::div",
                                                  wait_type=EC.visibility_of_element_located,
                                                  element_cls=BaseElement)

    def get_script(self):
        return self.txb_script.get_element_text()

    def open_integration_page(self):
        self.open_page(self.path_page)
