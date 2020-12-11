from Core.Base.BaseApi import BaseApi
from API.SignIn import SignIn
from Config import YAML_CONFIG
from enum import Enum


class AppearanceSetting(Enum):
    BOT_NAME = "name"
    BOT_TITLE = "chatboxTitle"
    BOT_BACKGROUND_COLOR = "botBackgroundColor"
    BOT_TEXT_COLOR = "botTextColor"
    USER_BACKGROUND_COLOR = "userBackgroundColor"
    USER_TEXT_COLOR = "userTextColor"


class Appearance(BaseApi):
    def __init__(self, bot_id=YAML_CONFIG.get("sample_app_bot_id")):
        super().__init__(f"/bot/{bot_id}")
        self.bot_id = bot_id
        self.__sign_in = SignIn()
        self.__get_token_by_sign_in()

    def __get_token_by_sign_in(self):
        self.__sign_in.sign_in_successfully()

    @property
    def jwt_token(self):
        return self.__sign_in.jwt_token

    def change_bot_title(self, new_title):
        return self.change_appearance_settings([AppearanceSetting.BOT_TITLE], [new_title])

    def change_bot_name(self, new_name):
        return self.change_appearance_settings([AppearanceSetting.BOT_NAME], [new_name])

    def change_bot_background_color(self, new_color):
        return self.change_appearance_settings([AppearanceSetting.BOT_BACKGROUND_COLOR], [new_color])

    def change_bot_text_color(self, new_color):
        return self.change_appearance_settings([AppearanceSetting.BOT_TEXT_COLOR], [new_color])

    def change_user_background_color(self, new_color):
        return self.change_appearance_settings([AppearanceSetting.USER_BACKGROUND_COLOR], [new_color])

    def change_user_text_color(self, new_color):
        return self.change_appearance_settings([AppearanceSetting.USER_TEXT_COLOR], [new_color])

    def change_appearance_settings(self, settings, values):
        """

        :param settings: Array which contains AppearanceSetting value or string value as setting key
        :param values: Array of respective setting value
        :return:
        """
        data = dict()
        for idx, setting in enumerate(settings):
            if isinstance(setting, AppearanceSetting):
                data[setting.value] = values[idx]
            else:
                data[setting] = values[idx]

        self.put(data=data, headers={"Authorization": self.jwt_token, "Content-Type": "application/json"})
        return self.response_code, self.response_body
