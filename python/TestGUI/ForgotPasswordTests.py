from ddt import ddt, data, unpack

from Core.Base.BaseTest import BaseTest
from Utils.DataUtils import DataUtils
from Utils.DataGenerateUtils import DataGenerateUtils
from Data.GUI import INVALID_DATA_FOR_FORGOT_PASSWORD
from API.SignUp import SignUp
from GUI.POM.ForgotPassword.ForgotPassword import ForgotPasswordPage
from Model.Customer import Customer
from Config import YAML_CONFIG
from Utils.DatabaseUtils import DatabaseHelper
from Core.DatabaseFactory.DatabaseType import DatabaseType


@ddt
class ForgotPasswordTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(ForgotPasswordTests, self).__init__(*args, **kwargs)
        self.__forgot_password_page = ForgotPasswordPage()
        self.verified_email = YAML_CONFIG.get("sample_app_user")

    @classmethod
    def setUpClass(cls):
        data_gen = DataGenerateUtils()
        cls.email = data_gen.create_email()
        cls.password = data_gen.create_password()
        # Create new account and verify success
        sign_up_api = SignUp()
        sign_up_api.create_new_user_account("username", cls.email, cls.password)
        assert sign_up_api.response_code == 200, "Fail when create unverified email account"

        # Get current reset password token
        cls.old_reset_password_token = cls.get_reset_password_token()

    @classmethod
    def get_reset_password_token(cls, email=YAML_CONFIG.get("sample_app_user")):
        redis_db = DatabaseHelper(DatabaseType.REDIS_DB)

        records = redis_db.database_query.get_list_item_in_collection("Token", "RecoverPassword")
        for ind in range(len(records)):
            if records[ind]["email"] == email:
                return records[ind]["passwordVerificationToken"]

        return ""

    @classmethod
    def tearDownClass(cls):
        # Remove created account from database
        customer_md = Customer()
        customer_md.delete_customer_by_email(cls.email)

    def setUp(self):
        self.__forgot_password_page.open_forgot_password_page()
        self.__forgot_password_page.wait_for_forgot_password_page()

    @data(*DataUtils().get_data(INVALID_DATA_FOR_FORGOT_PASSWORD))
    @unpack
    def test_request_reset_link_with_empty(self, email, error_message):
        """
        Test for invalid cases: empty email, invalid format email, account not found
        """
        self.__forgot_password_page.submit_email(email)
        self.verify_returned_message(error_message)
        self.verify_submit_button_text_is_resend()

    def test_request_reset_link_with_unverified_email(self):
        """
        Test request resetting password for unverified email which is prepared in setUpClass
        """
        unverified_email_message = "Your email needs to be verified first."
        self.__forgot_password_page.submit_email(self.email)
        self.verify_returned_message(unverified_email_message)
        self.verify_submit_button_text_is_resend()

    def test_request_reset_link_successfully(self):
        success_message = "Please check your email to continue."
        self.__forgot_password_page.submit_email(self.verified_email)
        self.verify_returned_message(success_message)
        # Verify new reset password token is generated
        new_reset_password_token = self.get_reset_password_token()
        assert new_reset_password_token != self.old_reset_password_token, "Reset password token is not renew"

    def verify_returned_message(self, expected_message):
        error_message = self.__forgot_password_page.lbl_error_message.get_element_text()
        assert error_message == expected_message, f"Error message is '{error_message}' instead of '{expected_message}'"

    def verify_submit_button_text_is_resend(self, expected_button_text="RE-SEND RESET LINK"):
        submit_button_text = self.__forgot_password_page.btn_send.get_element_text()
        assert submit_button_text == expected_button_text, \
            f"Submit button text is '{submit_button_text}' instead of '{expected_button_text}'"
