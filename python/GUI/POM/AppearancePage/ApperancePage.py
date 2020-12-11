from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from Core.Base.BasePage import BasePage
from Core.Config.SeleniumElement import SeleniumElement
from Core.Config.Service.ElementFinder import ElementFactory
import time


class AppearancePage(BasePage):
    timeout = 10
    update_info_timeout = 1
    path_page = "/admin/setting_bot/appearance"
    lbl_header_title = ElementFactory.get_element_until(by=By.CSS_SELECTOR, element_cls=SeleniumElement,
                                                        locator="h2.header",
                                                        wait_type=EC.visibility_of_element_located,
                                                        time_out=120
                                                        )

    txb_title = ElementFactory.get_element_until(by=By.ID, locator="titleField",
                                                 wait_type=EC.visibility_of_element_located,
                                                 element_cls=SeleniumElement)

    txb_bot_name = ElementFactory.get_element_until(by=By.ID, locator="nameField",
                                                    wait_type=EC.visibility_of_element_located,
                                                    element_cls=SeleniumElement)

    img_avatar = ElementFactory.get_element_until(by=By.XPATH, locator="//*[@id='nameField']/../../..//img",
                                                  wait_type=EC.visibility_of_element_located,
                                                  element_cls=SeleniumElement)

    input_ava = ElementFactory.get_element_until(by=By.XPATH, locator="//input[@accept]",
                                                 wait_type=EC.visibility_of_element_located,
                                                 element_cls=SeleniumElement)

    lbl_error_message_of_upload_avatar = ElementFactory.get_element_until(by=By.XPATH,
                                                                          locator="//input[@accept]/../../span",
                                                                          wait_type=EC.visibility_of_element_located,
                                                                          element_cls=SeleniumElement)

    btn_cancel_upload_avatar = ElementFactory.get_element_until(by=By.XPATH,
                                                                locator="//button[@name='cancelButton']",
                                                                wait_type=EC.visibility_of_element_located,
                                                                element_cls=SeleniumElement
                                                                )

    btn_save_uploaded_avatar = ElementFactory.get_element_until(by=By.XPATH,
                                                                locator="//button[@name='saveButton']",
                                                                wait_type=EC.visibility_of_element_located,
                                                                element_cls=SeleniumElement)

    def get_header_title_text(self):
        return self.lbl_header_title.get_element_text()

    def get_expected_title(self, bot_name):
        # Title is converted to uppercase
        return "{}'S APPEARANCE".format(bot_name.upper())

    def open_appearance_page(self):
        self.open_page(self.path_page)

    def wait_for_appearance_page(self, time_out=None):
        time_out = time_out if time_out is not None else self.timeout
        self.wait_for_page(self.path_page, time_out)

    def change_bot_title(self, new_title):
        # Work around instead of clear_and_send_keys due to element is not user-editable
        self.txb_title.click()
        self.txb_title.clear_and_send_keys(new_title)
        self.lbl_header_title.click()
        time.sleep(self.update_info_timeout)

    def change_bot_name(self, new_name):
        self.txb_bot_name.click()
        self.txb_bot_name.clear_and_send_keys(new_name)
        self.lbl_header_title.click()
        time.sleep(self.update_info_timeout)

    def update_avatar(self, file_path):
        self.img_avatar.click()
        self.input_ava.send_keys(file_path)
        self.btn_save_uploaded_avatar.click()
