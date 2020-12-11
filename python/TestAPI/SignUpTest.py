from API.SignUp import SignUp
from Core.Base.BaseTest import BaseTest
from Core.Assertions.Assertion import APIAssert
from Utils.DataGenerateUtils import DataGenerateUtils as DataGenerate
from Utils.JSONUtils import JSONUtils


class SignUpTest(BaseTest):
    INVALID_PARAM = 13
    EXISTING_EMAIL = 12

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__sign_up = SignUp()
        self.__data = DataGenerate()

    def tearDown(self):
        super().tearDown()
        self.API_PAY_LOAD.append(self.__sign_up.post_data)

    def test_sign_up_successfully_with_valid_data(self):
        self.__sign_up.create_new_user_account(username=self.__data.create_name(),
                                               email=self.__data.create_email(),
                                               password=self.__data.create_password())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 200),
            self.assert_container(self.assertIn, self.__sign_up.post_data['username'], self.__sign_up.response_body),
            self.assert_container(self.assertIn, self.__sign_up.post_data['email'], self.__sign_up.response_body),
            self.assert_container(self.assertGreater,
                                  len(JSONUtils.get_value_json_string(self.__sign_up.response_body, "jwtToken")), 20)
        )

    def test_sign_up_unsuccessfully_with_existing_email(self):
        username = self.__data.create_name()
        email = self.__data.create_email()
        password = self.__data.create_password()
        self.__sign_up.create_new_user_account(username=username,
                                               email=email,
                                               password=password)
        self.API_PAY_LOAD.append(self.__sign_up.post_data)
        self.__sign_up.create_new_user_account(username=username,
                                               email=email,
                                               password=password)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.EXISTING_EMAIL,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_username(self):
        self.__sign_up.create_new_user_account(email=self.__data.create_email(),
                                               password=self.__data.create_number())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_email(self):
        self.__sign_up.create_new_user_account(username=self.__data.create_name(),
                                               password=self.__data.create_number())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_password(self):
        self.__sign_up.create_new_user_account(username=self.__data.create_name(),
                                               email=self.__data.create_email())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_username_email(self):
        self.__sign_up.create_new_user_account(password=self.__data.create_number())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_username_password(self):
        self.__sign_up.create_new_user_account(email=self.__data.create_email())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_email_password(self):
        self.__sign_up.create_new_user_account(username=self.__data.create_name())
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )

    def test_sign_up_unsuccessfully_with_blank_all(self):
        self.__sign_up.create_new_user_account()
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, self.__sign_up.response_code, 400),
            self.assert_container(self.assertEqual, self.INVALID_PARAM,
                                  JSONUtils.get_value_json_string(self.__sign_up.response_body, "error")['code'])
        )
