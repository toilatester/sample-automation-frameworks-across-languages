from Core.Base.BaseTest import BaseTest
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.Component.DropDownList import DropDownList
from GUI.Component.ClientSimulator import ClientSimulator
from GUI.Component.LoaderComponent import LoaderComponent
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from Core.Exceptions.TestContextException import TestContextException
from Config import YAML_CONFIG
import unittest
from Data.Avatar import get_valid_avatar, get_list_invalid_size_avatar, get_list_invalid_type_avatar, \
    get_list_invalid_format_avatar


class AppearanceTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(AppearanceTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__appearance = AppearancePage()
        self.__create_bot_validation = CreateBotValidation()
        self.__drop_down_list = DropDownList()
        self.__chat_box_simulator = ClientSimulator()
        self.__loader = LoaderComponent()
        self.__data_set = DataUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.bot_name = self.__data.create_uuid_number()
        self.faq_url = YAML_CONFIG.get("stub_faq_url")

    def setUp(self):
        super().setUp()
        try:
            self.sign_in_for_ui_test(self.valid_username, self.valid_email, self.valid_password, self.bot_name,
                                     self.faq_url, False)
            self.__appearance.open_appearance_page()
            self.__appearance.wait_for_appearance_page()
        except Exception as e:
            raise TestContextException(e)

    def test_change_chat_bot_title_successfully(self):
        new_title = "test_debug"
        print(self.__appearance.txb_title.get_element_text())
        self.__appearance.change_bot_title(new_title)
        self.__appearance.driver.core_driver.refresh()
        self.__appearance.wait_for_appearance_page()
        assert self.__appearance.txb_title.get_element_text_value() == new_title, \
            f"Title is '{self.__appearance.txb_title.get_element_text_value()}' instead of '{new_title}'"

    def test_change_bot_name_successfully(self):
        new_name = "test_debug"
        self.__appearance.change_bot_name(new_name)
        self.__appearance.driver.core_driver.refresh()
        self.__appearance.wait_for_appearance_page()
        assert self.__appearance.txb_bot_name.get_element_text_value() == new_name, \
            f"Bot name is '{self.__appearance.txb_bot_name.get_element_text_value()}' instead of '{new_name}'"

    def test_update_avatar_successfully(self):
        valid_avatar = get_valid_avatar()
        last_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        self.__appearance.update_avatar(valid_avatar)
        self.__loader.wait_for_component_invisible()
        current_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        assert current_avatar_src != last_avatar_src, "Avatar has not been changed"
        assert self.__chat_box_simulator.get_bot_avatar_source() != last_avatar_src, \
            "Avatar in simulation has not been changed"

    def test_update_avatar_with_invalid_size_unsuccessfully(self):
        error_message = "File size must be less than 1MB."
        list_invalid_file = get_list_invalid_size_avatar()
        last_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        for value in list_invalid_file:
            self.upload_avatar_and_verify_error_message(value, error_message)
            self.verify_avatar_source_does_not_change(last_avatar_src)

    def test_update_avatar_with_invalid_file_type_unsuccessfully(self):
        error_message = "This file type is not supported."
        list_invalid_file = get_list_invalid_type_avatar()
        last_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        for value in list_invalid_file:
            self.upload_avatar_and_verify_error_message(value, error_message)
            self.verify_avatar_source_does_not_change(last_avatar_src)

    def test_update_avatar_with_invalid_format_unsuccessfully(self):
        error_message = "Uploaded file is not a valid image."
        list_invalid_file = get_list_invalid_format_avatar()
        last_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        for value in list_invalid_file:
            self.upload_avatar_and_verify_error_message(value, error_message)
            self.verify_avatar_source_does_not_change(last_avatar_src)

    def upload_avatar_and_verify_error_message(self, file_path, error_message):
        self.__appearance.driver.core_driver.refresh()
        self.__appearance.wait_for_appearance_page()
        self.__appearance.img_avatar.click()
        self.__appearance.input_ava.send_keys(file_path)
        actual_error_message = self.__appearance.lbl_error_message_of_upload_avatar.get_element_text()
        assert actual_error_message == error_message, \
            f"'{actual_error_message}' is displayed when upload invalid format avatar {file_path}"

    def verify_avatar_source_does_not_change(self, current_avatar_src):
        self.__appearance.btn_cancel_upload_avatar.click()
        self.__appearance.driver.core_driver.refresh()
        self.__appearance.wait_for_appearance_page()
        actual_avatar_src = self.__appearance.img_avatar.get_element_attribute("src")
        assert actual_avatar_src == current_avatar_src, "Avatar has been changed"

    @unittest.skip("TODO TEST")
    def test_integration_website_reflect_change_on_appearance(self):
        pass
