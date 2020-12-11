from API import CreateBot
from Core.Base.BaseTest import BaseTest
from Config import YAML_CONFIG


class CreateBotTest(BaseTest):
    REQUIRED_FILED_ERROR_MSG = "Please fill all required field."
    REQUIRED_FILED_ERROR_CODE = 21

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__create_bot = CreateBot()

    def test_create_bot_successfully(self):
        self.__create_bot.create_new_bot(YAML_CONFIG.get("stub_faq_url"), "test_auto")
        assert self.__create_bot.response_code == 200, self.__create_bot.response_body
        assert len(self.__create_bot.get_bot_data_in_db(
            self.__create_bot.default_user_email)) > 0, self.__create_bot.get_bot_data_in_db(
            self.__create_bot.default_user_email)
        assert self.__create_bot.get_bot_data_in_db(self.__create_bot.default_user_email)['website'] == YAML_CONFIG.get(
            "stub_faq_url"), self.__create_bot.get_bot_data_in_db(self.__create_bot.default_user_email)

    def test_crate_bot_successfully_with_invalid_url(self):
        self.__create_bot.create_new_bot(YAML_CONFIG.get("stub_invalid_faq_url"), "test_auto")
        assert self.__create_bot.response_code == 200, self.__create_bot.response_body
        assert len(self.__create_bot.get_bot_data_in_db(
            self.__create_bot.default_user_email)) > 0, self.__create_bot.get_bot_data_in_db(
            self.__create_bot.default_user_email)
        assert self.__create_bot.get_bot_data_in_db(self.__create_bot.default_user_email)['website'] == YAML_CONFIG.get(
            "stub_invalid_faq_url"), self.__create_bot.get_bot_data_in_db(self.__create_bot.default_user_email)

    def test_create_bot_unsuccessfully_with_empty_url(self):
        self.__create_bot.create_new_bot("", "test_auto")
        assert self.__create_bot.response_code == 400, self.__create_bot.response_body
        assert self.__create_bot.get_value_in_json_response_body("error")[
                   'code'] == CreateBotTest.REQUIRED_FILED_ERROR_CODE, self.__create_bot.response_body
        assert self.__create_bot.get_value_in_json_response_body("error")[
                   "message"] == CreateBotTest.REQUIRED_FILED_ERROR_MSG, self.__create_bot.response_body

    def test_create_bot_unsuccessfully_with_empty_bot_name(self):
        self.__create_bot.create_new_bot(YAML_CONFIG.get("stub_faq_url"), "")
        assert self.__create_bot.response_code == 400, self.__create_bot.response_body
        assert self.__create_bot.get_value_in_json_response_body("error")[
                   'code'] == CreateBotTest.REQUIRED_FILED_ERROR_CODE, self.__create_bot.response_body
        assert self.__create_bot.get_value_in_json_response_body("error")[
                   "message"] == CreateBotTest.REQUIRED_FILED_ERROR_MSG, self.__create_bot.response_body
