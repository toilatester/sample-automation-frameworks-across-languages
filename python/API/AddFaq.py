from API.SignIn import SignIn
from Core.Base.BaseApi import BaseApi
from Config import YAML_CONFIG


class AddFaq(BaseApi):
    def __init__(self, bot_id=YAML_CONFIG.get("sample_app_bot_id")):
        super().__init__("/bot/{}/knowledges/faq_url".format(bot_id))
        self.__bot_id = bot_id
        self.__sign_in = SignIn()
        self.__get_token_by_sign_in()

    def __get_token_by_sign_in(self):
        self.__sign_in.sign_in_successfully()

    def add_new_faq(self, url=None):
        self.post_data = {"faqUrl": url}
        self.post(data=self.post_data, headers={"Authorization": self.__sign_in.jwt_token
            , "Content-Type": "application/json"})
        return self.response_code, self.response_body

    @property
    def bot_id(self):
        return self.__bot_id
