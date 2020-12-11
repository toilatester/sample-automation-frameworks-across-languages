from selenium.webdriver.common.by import By

from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.Service.ElementFinder import ElementFactory


class LoginPage(BasePage):
    path_page = "/account/login"
    loading_page_timeout = 10
    txt_email = ElementFactory.get_element(by=By.ID, locator="email-input", element_cls=SeleniumElement)
    txt_password = ElementFactory.get_element(by=By.ID, locator="password-input", element_cls=SeleniumElement)
    btn_login = ElementFactory.get_element(by=By.ID, locator="signin-button", element_cls=SeleniumElement)
    lbl_error_message = ElementFactory.get_element(by=By.XPATH, locator="//button[text()='Sign in again']/../span",
                                                   element_cls=SeleniumElement)
    ckb_remember_me = ElementFactory.get_element(by=By.ID, locator="remember-me-checkbox",
                                                 element_cls=SeleniumElement)

    @property
    def txt_header_text(self):
        return "Nice to see you here!"

    def login_with_account(self, email, password):
        self.open_login_page()
        self.input_login_with_account(email, password)
        self.click_login_button()

    def open_login_page(self):
        self.open_page(self.path_page)

    def input_login_with_account(self, email, password):
        self.txt_email.clear_and_send_keys(email)
        self.txt_password.clear_and_send_keys(password)

    def click_login_button(self):
        self.btn_login.click()

    def wait_for_log_in_page(self):
        self.wait_for_page(path=self.path_page, timeout=self.loading_page_timeout)

    def check_remember_me(self, check=True):
        if check != self.ckb_remember_me.is_selected():
            self.driver.core_driver.execute_script("arguments[0].click()", self.ckb_remember_me.get_wrapper_element)
