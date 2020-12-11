from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import visibility_of_element_located, staleness_of
from selenium.webdriver.support.wait import WebDriverWait
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.Service.ElementFinder import ElementFactory


class ChangePasswordPage(BasePage):
    page_load_timeout = 10
    change_password_timeout = 10
    path_page = "/admin/manage_account/change_password"
    txb_old_password = ElementFactory.get_element_until(
        by=By.ID, locator="old-password-input",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    txb_new_password = ElementFactory.get_element_until(
        by=By.ID, locator="new-password-input",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    txb_confirm_password = ElementFactory.get_element_until(
        by=By.ID, locator="confirm-new-password-input",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    btn_submit = ElementFactory.get_element_until(
        by=By.ID, locator="change-password-button",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    btn_cancel = ElementFactory.get_element_until(
        by=By.ID, locator="cancel-button",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    txt_error_message = ElementFactory.get_element_until(
        by=By.XPATH, locator="//button[@id='change-password-button']/../../span",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    txt_success_message = ElementFactory.get_element_until(
        by=By.XPATH, locator="//*[@id='return-dashboard-button']/../../span",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )
    btn_back_to_dashboard = ElementFactory.get_element_until(
        by=By.ID, locator="return-dashboard-button",
        wait_type=visibility_of_element_located,
        element_cls=SeleniumElement
    )

    def open_change_password_page(self):
        self.open_page(self.path_page)

    def wait_for_change_password_page(self):
        self.wait_for_page(self.path_page, self.page_load_timeout)

    def change_password(self, old_password, new_password, confirm_password=None):
        self.txb_old_password.clear_and_send_keys(old_password)
        self.txb_new_password.clear_and_send_keys(new_password)
        if confirm_password is not None:
            self.txb_confirm_password.clear_and_send_keys(confirm_password)
        else:
            self.txb_confirm_password.clear_and_send_keys(new_password)
        self.btn_submit.click()

    def get_error_message(self):
        return self.txt_error_message.get_element_text()

    def get_success_message(self):
        return self.txt_success_message.get_element_text()

    # TODO(namndoan): it may not work
    def wait_for_button_submit_disappear(self):
        return WebDriverWait(driver=self.driver, timeout=self.change_password_timeout).until(
            staleness_of(self.btn_submit.get_wrapper_element),
            f"Button submit is still displayed after {self.change_password_timeout}s"
        )

    def wait_for_button_back_to_dashboard_display(self):
        # Wait for button back to dashboard visible
        return self.btn_back_to_dashboard

    # Additional code for logging out
    div_user_options = ElementFactory.get_element_until(element_cls=SeleniumElement, by=By.ID,
                                                        locator="user-options-dropdown",
                                                        wait_type=visibility_of_element_located)
    btn_log_out = ElementFactory.get_element_until(
        element_cls=SeleniumElement, by=By.XPATH,
        locator="//*[@id='user-options-dropdown']//div//span[text()='Sign-out']",
        wait_type=visibility_of_element_located
    )

    def log_out(self):
        self.div_user_options.click()
        self.btn_log_out.click()
