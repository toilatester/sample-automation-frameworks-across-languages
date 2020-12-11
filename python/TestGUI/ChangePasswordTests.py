from Core.Base.BaseTest import BaseTest
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.POM.ChangePassword.ChangePasswordPage import ChangePasswordPage
from GUI.POM.Dashboard.DashboardPage import DashboardPage
from GUI.Component.DropDownList import DropDownList
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from Data.GUI import INVALID_DATA_FOR_CHANGE_PASSWORD


class ChangePasswordTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(ChangePasswordTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__dashboard = DashboardPage()
        self.__appearance = AppearancePage()
        self.__create_bot_validation = CreateBotValidation()
        self.__drop_down_list = DropDownList()
        self.__change_password = ChangePasswordPage()
        self.__data_set = DataUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.bot_name = "Test"
        self.invalid_faq = "google.com"

    def setUp(self):
        super().setUp()
        try:
            self.sign_in_for_ui_test(self.valid_username, self.valid_email, self.valid_password,
                                     self.bot_name, self.invalid_faq, False)
        finally:
            self.__change_password.open_change_password_page()

    def test_change_password_unsuccessfully_with_invalid_data(self):
        invalid_data = self.__data_set.get_data(INVALID_DATA_FOR_CHANGE_PASSWORD)
        for data in invalid_data:
            old_password = data[0]
            new_password = data[1]
            confirm_password = data[2]
            error_message = data[3]
            self.__change_password.change_password(old_password, new_password, confirm_password)
            print(data)
            assert self.__change_password.get_error_message() == error_message, \
                f"Expect error message '{error_message}' but '{self.__change_password.get_error_message()}' is returned"
            assert self.__change_password.btn_submit.get_element_text() == "RETRY", \
                f"Expect button submit change to 'RETRY' but '{self.__change_password.btn_submit.get_element_text()}'"
        # Incorrect current password
        self.__change_password.change_password(self.valid_password + "123", "password", "password")
        assert self.__change_password.get_error_message() == "Your current password is not correct.", \
            f"Expect error message 'Your current password is not correct.' " \
            f"but '{self.__change_password.get_error_message()}' is returned"
        assert self.__change_password.btn_submit.get_element_text() == "RETRY", \
            f"Expect button submit change to 'RETRY' but '{self.__change_password.btn_submit.get_element_text()}'"

    def test_change_password_unsuccessfully_with_wrong_current_password(self):
        # Make old password become incorrect
        old_password = self.valid_password + "123"
        new_password = "new_password"
        expected_error_message = "Your current password is not correct."
        self.__change_password.change_password(old_password, new_password, new_password)
        actual_error_message = self.__change_password.get_error_message()
        assert actual_error_message == expected_error_message, \
            f"Expect '{expected_error_message}' but '{actual_error_message}' is displayed"
        assert self.__change_password.btn_submit.get_element_text() == "RETRY", \
            f"Expect button submit change to 'RETRY' but '{self.__change_password.btn_submit.get_element_text()}'"

    def test_change_password_successfully(self):
        new_password = "new_password"
        success_message = "Your password has been updated successfully."
        # Change Password
        self.__change_password.change_password(self.valid_password, new_password, new_password)
        # Verify
        actual_message = self.__change_password.get_success_message()
        assert actual_message == success_message, \
            f"Expect '{success_message}' but '{actual_message}' is displayed"
        self.__change_password.wait_for_button_back_to_dashboard_display()
        # Sign out
        self.__change_password.log_out()
        self.__login.wait_for_log_in_page()
        # Verify login successfully with new password
        self.__login.login_with_account(self.valid_email, new_password)
        self.__dashboard.wait_for_dashboard_page()
