from API.SignIn import SignIn
from Core.Base.BaseApi import BaseApi
from Config import YAML_CONFIG


class TrainFaq(BaseApi):
    URL = "www.locmai.com"

    def __init__(self, bot_id=YAML_CONFIG.get("sample_app_bot_id")):
        super().__init__("/bot/{}/knowledges/train".format(bot_id))
        self.__bot_id = bot_id
        self.__sign_in = SignIn()
        self.__get_token_by_sign_in()
        self.__pending_faqs = TrainFaq.PendingFAQ(bot_id, self.__sign_in.jwt_token)

    @property
    def bot_id(self):
        return self.__bot_id

    def __get_token_by_sign_in(self):
        self.__sign_in.sign_in_successfully()

    def train_faqs_with_jwt_token(self):
        self.get(headers={"Authorization": self.__sign_in.jwt_token, "Content-Type": "application/json"})
        return self.response_code, self.response_body

    def train_faqs_without_jwt_token(self):
        self.get(headers={"Content-Type": "application/json"})
        return self.response_code, self.response_body

    def get_number_of_pending_faqs(self):
        self.__pending_faqs.get_number_of_pending_faqs()
        return self.__pending_faqs.get_value_in_json_response_body("knowledgeUpdate")["length"]

    class PendingFAQ(BaseApi):
        def __init__(self, bot_id, jwt_token):
            super().__init__("/bot/{}/knowledges/updates".format(bot_id))
            self.__jwt_token = jwt_token

        def get_number_of_pending_faqs(self):
            self.get(headers={"Authorization": self.__jwt_token, "Content-Type": "application/json"})
            return self.response_code, self.response_body
