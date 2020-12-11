from API.Appearance import Appearance, AppearanceSetting
from Core.Base.BaseTest import BaseTest
from Core.DatabaseFactory.DatabaseType import DatabaseType
from Utils.DataUtils import DataUtils
from Data.FAQs import FAQ_DATA_PATH, FAQ_URLS
from os import path
from Utils.DatabaseUtils import DatabaseHelper

DEFAULT_BOT_BACKGROUND = "#f3f5fa"
DEFAULT_BOT_TEXT = "#494963"
DEFAULT_USER_BACKGROUND = "#494963"
DEFAULT_USER_TEXT = "#ffffff"

SUCCESS_CODE = 200


class ChangeAppearanceTest(BaseTest):
    data = []
    EXCEPTION_ERROR = "Exception when execute API"
    ERROR_MISSING_FAQ_URL = "400: Bad Request: Missing faq url"

    __appearance = Appearance()
    __db_helper = DatabaseHelper(DatabaseType.MONGO_DB)

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        data_path = path.join(FAQ_DATA_PATH, FAQ_URLS)
        self.data = DataUtils().get_data(file_name=data_path)

    def setUp(self):
        super().setUp()

    def test_change_bot_background_color_successfully(self):
        new_background_color = "#123456"
        self.__appearance.change_bot_background_color(new_background_color)
        self.verify_status_code_is(SUCCESS_CODE)
        self.verify_value_in_responded_bot_info(AppearanceSetting.BOT_BACKGROUND_COLOR.value, new_background_color)

    def test_change_bot_text_color_successfully(self):
        new_text_color = "#123456"
        self.__appearance.change_bot_text_color(new_text_color)
        self.verify_status_code_is(SUCCESS_CODE)
        self.verify_value_in_responded_bot_info(AppearanceSetting.BOT_TEXT_COLOR.value, new_text_color)

    def test_change_user_background_color_successfully(self):
        new_background_color = "#123456"
        self.__appearance.change_user_background_color(new_background_color)
        self.verify_status_code_is(SUCCESS_CODE)
        self.verify_value_in_responded_bot_info(AppearanceSetting.USER_BACKGROUND_COLOR.value, new_background_color)

    def test_change_user_text_color_successfully(self):
        new_text_color = "#123456"
        self.__appearance.change_user_text_color(new_text_color)
        self.verify_status_code_is(SUCCESS_CODE)
        self.verify_value_in_responded_bot_info(AppearanceSetting.USER_TEXT_COLOR.value, new_text_color)

    def verify_status_code_is(self, status_code):
        assert self.__appearance.response_code == status_code, \
            f"Response code is {self.__appearance.response_code} instead of {status_code}"

    def verify_value_in_responded_bot_info(self, key, expected_value):
        actual_background_color = self.__appearance.get_value_in_json_response_body("botInfo")[key]
        assert actual_background_color == expected_value, \
            f"New {key} is '{actual_background_color}' instead of {expected_value}"

    def tearDown(self):
        super().tearDown()
        # Change bot appearance to default values
        self.__appearance.change_appearance_settings(
            [AppearanceSetting.BOT_BACKGROUND_COLOR, AppearanceSetting.BOT_TEXT_COLOR,
             AppearanceSetting.USER_BACKGROUND_COLOR, AppearanceSetting.USER_TEXT_COLOR],
            [DEFAULT_BOT_BACKGROUND, DEFAULT_BOT_TEXT, DEFAULT_USER_BACKGROUND, DEFAULT_USER_TEXT]
        )
