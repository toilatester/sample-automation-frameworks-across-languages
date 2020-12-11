from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import visibility_of_element_located, element_to_be_clickable
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.Service.ElementFinder import ElementFactory
from Core.Config.Settings import Settings


class ResetPasswordPage(BasePage):
    page_load_timeout = 10
    change_password_timeout = 10
    path_page = "/account/reset_password"

    txb_new_password = ElementFactory.get_element_until(by=By.ID, locator="password-input",
                                                        wait_type=visibility_of_element_located,
                                                        element_cls=SeleniumElement
                                                        )

    btn_change_password = ElementFactory.get_element_until(by=By.ID,
                                                           locator="signin-button",
                                                           wait_type=visibility_of_element_located,
                                                           element_cls=SeleniumElement
                                                           )

    lbl_error_message = ElementFactory.get_element_until(by=By.XPATH,
                                                         locator="//*[@id='signin-button']/preceding-sibling::*",
                                                         wait_type=visibility_of_element_located,
                                                         element_cls=SeleniumElement)

    def open_reset_password_page(self, token):
        self.open_page(ResetPasswordPage.get_full_url_from_token(token))

    def wait_for_forgot_password_page(self):
        self.txb_new_password

    def reset_password(self, new_password):
        self.txb_new_password.clear_and_send_keys(new_password)
        self.btn_change_password.click()

    @staticmethod
    def get_full_url_from_token(token):
        url_pattern = "{}/auth/recover_password?token={}"
        return url_pattern.format(Settings.BASE_URL, token)
