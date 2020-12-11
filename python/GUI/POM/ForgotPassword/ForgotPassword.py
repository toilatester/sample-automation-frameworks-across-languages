from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import visibility_of_element_located, element_to_be_clickable
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.Service.ElementFinder import ElementFactory


class ForgotPasswordPage(BasePage):
    page_load_timeout = 10
    change_password_timeout = 10
    path_page = "/account/forgot_password"

    txb_email = ElementFactory.get_element_until(by=By.ID, locator="email-input",
                                                 wait_type=visibility_of_element_located, element_cls=SeleniumElement
                                                 )

    btn_send = ElementFactory.get_element_until(by=By.ID, locator="signin-button", wait_type=element_to_be_clickable,
                                                element_cls=SeleniumElement
                                                )

    lbl_error_message = ElementFactory.get_element_until(by=By.XPATH,
                                                         locator="//*[@id='signin-button']/preceding-sibling::*",
                                                         wait_type=visibility_of_element_located,
                                                         element_cls=SeleniumElement
                                                         )

    def open_forgot_password_page(self):
        self.open_page(self.path_page)

    def wait_for_forgot_password_page(self):
        self.wait_for_page(self.path_page, self.page_load_timeout)

    def submit_email(self, email):
        self.txb_email.clear_and_send_keys(email)
        self.btn_send.click()
