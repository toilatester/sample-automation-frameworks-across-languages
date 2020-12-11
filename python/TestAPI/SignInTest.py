from API import SignIn, SignUp
from Core.Base.BaseTest import BaseTest
from Core.Assertions.Assertion import APIAssert
from Utils.JSONUtils import JSONUtils
from Utils.DataGenerateUtils import DataGenerateUtils


class SignInTest(BaseTest):
    # Currently these are the prepared data
    # We want to quick start the API Test so we set it here
    DEFAULT_PASSWORD = "12345678"
    INVALID_EMAIL = "somethingiswrongwiththisusernamepleasedontsignupwithit@gmail.com"
    INVALID_PASSWORD = "^&%$^%#%^$@#%$$*^$"
    INVALID_INPUT = 14
    INVALID_PARAM = 13
    BLANK_FIELD_CODE = 14
    NO_EMAIL_CODE = 14

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__data = DataGenerateUtils()
        self.__sign_in = SignIn()

    def setUp(self):
        super().setUp()
        self.__email = self.__data.create_email()
        self.__sign_up = SignUp()
        self.__sign_up.create_new_user_account(self.__email, self.__email, self.DEFAULT_PASSWORD)

    def tearDown(self):
        super().tearDown()
        self.API_PAY_LOAD.append(self.__sign_up.post_data)
        self.API_PAY_LOAD.append(self.__sign_in.post_data)

    def test_sign_in_successfully_with_valid_data(self):
        self.__sign_in.sign_in(email=self.__email,
                               password=self.DEFAULT_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 200),
            self.assert_container(self.assertGreater,
                                  len(JSONUtils.get_value_json_string(self.__sign_in.response_body, "jwtToken")), 20)
        )

    def test_sign_in_unsuccessfully_with_invalid_email(self):
        self.__sign_in.sign_in(email=self.INVALID_EMAIL,
                               password=self.DEFAULT_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.BLANK_FIELD_CODE,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_password(self):
        self.__sign_in.sign_in(email=self.__email,
                               password=self.INVALID_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_email_password(self):
        self.__sign_in.sign_in(email=self.INVALID_EMAIL,
                               password=self.INVALID_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.BLANK_FIELD_CODE,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_param_invalid_email(self):
        self.__sign_in.sign_in(email="invalid_email", password=self.DEFAULT_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.NO_EMAIL_CODE,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_param_no_email(self):
        self.__sign_in.sign_in(email="", password=self.DEFAULT_PASSWORD)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_param_no_password(self):
        self.__sign_in.sign_in_with_invalid_pass(email=self.__email, password="")
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_param_invalid_password(self):
        self.__sign_in.sign_in_with_invalid_pass(email=self.__email, password="ssssssss")
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )

    def test_sign_in_unsuccessfully_with_invalid_param_no_email_password(self):
        self.__sign_in.sign_in()
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_in.response_code, 400),
            self.assert_container(self.assertEqual,
                                  self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_in.response_body, "error")['code'])
        )
