from selenium.webdriver.common.by import By
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.SeleniumElement.InputElement import InputElement
from Core.Config.Service.ElementFinder import ElementFactory


class RegisterPage(BasePage):
    timeout = 10
    path_page = "/account/register"
    txt_username = ElementFactory.get_element(by=By.CSS_SELECTOR, locator="input#name-input",
                                              element_cls=SeleniumElement)
    txt_email = ElementFactory.get_element(by=By.CSS_SELECTOR, locator="input#email-input",
                                           element_cls=SeleniumElement)
    txt_password = ElementFactory.get_element(by=By.CSS_SELECTOR, locator="#password-input",
                                              element_cls=SeleniumElement)
    btn_register = ElementFactory.get_element(by=By.CSS_SELECTOR, locator="#register-button",
                                              element_cls=SeleniumElement)
    btn_register_temp = ElementFactory.get_element(by=By.XPATH, locator="//button[text()='REGISTER']",
                                                   element_cls=InputElement)
    lbl_error_message = ElementFactory.get_element(by=By.XPATH, locator="//button[text()='Register again']/../span",
                                                   element_cls=SeleniumElement)
    ckb_remember_me = ElementFactory.get_element(by=By.ID, locator="remember-me-checkbox",
                                                 element_cls=SeleniumElement)


    @property
    def txt_header_text(self):
        return "Get started!"

    def open_register_page(self):
        self.open_page(self.path_page)

    def login_with_new_account(self, username, email, password):
        self.register_with_account(username, email, password)
        self.agree_with_terms_and_conditions()
        self.click_register_button()

    def register_with_account(self, username, email, password):
        self.txt_username.send_keys(username)
        self.txt_email.send_keys(email)
        self.txt_password.send_keys(password)

    def agree_with_terms_and_conditions(self, is_agree=True):
        if is_agree != self.ckb_remember_me.is_selected():
            self.driver.core_driver.execute_script("arguments[0].click()", self.ckb_remember_me.get_wrapper_element)

    def click_register_button(self):
        self.btn_register.click()

    def wait_for_register_page(self):
        self.wait_for_page(self.path_page, self.timeout)
