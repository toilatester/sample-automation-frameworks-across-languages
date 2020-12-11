from Core.Base.BaseApi import BaseApi
from API.SignIn import SignIn
from Config import YAML_CONFIG


class Personalities(BaseApi):
    def __init__(self, bot_id=YAML_CONFIG.get("sample_app_bot_id")):
        super().__init__("/bot/{}/personality".format(bot_id))
        self.__bot_id = bot_id
        self.__crud_personality = None
        self.__sign_in = SignIn()
        self.__get_token_by_sign_in()

    def __get_token_by_sign_in(self):
        self.__sign_in.sign_in_successfully()

    def create_crud_endpoint_with_question_id(self, question_id):
        self.__crud_personality = Personalities.CRUDPersonality(bot_id=self.__bot_id,
                                                                question_id=question_id,
                                                                jwt_token=self.__sign_in.jwt_token)
        return self.__crud_personality

    @property
    def crud_personality(self):
        if self.__crud_personality is None:
            raise Exception("CRUD Personality is not created yet.")
        return self.__crud_personality

    def get_personalities(self, limit=12, offset=0):
        params = {
            "limit": limit,
            "offset": offset
        }
        self.get(params=params,
                 headers={"Authorization": self.__sign_in.jwt_token, "Content-Type": "application/json"})
        return self.response_code, self.response_body

    class CRUDPersonality(BaseApi):
        def __init__(self, bot_id, question_id, jwt_token):
            super().__init__("/bot/{}/personality/question/{}/response".format(bot_id, question_id))
            self.__jwt_token = jwt_token

        def add_personality(self, responses=None, indexes=None):
            data = dict()
            if responses is not None:
                data["responses"] = responses
            if indexes is not None:
                data["responseIdxs"] = indexes

            self.post(data=data, headers={"Authorization": self.__jwt_token,
                                          "Content-Type": "application/json"})
            return self.response_code, self.response_body

        def update_personality(self, old_response=None, new_response=None):
            data = dict()
            if old_response is not None:
                data["oldResponse"] = old_response
            if new_response is not None:
                data["newResponse"] = new_response

            self.put(data=data, headers={"Authorization": self.__jwt_token,
                                         "Content-Type": "application/json"})
            return self.response_code, self.response_body

        def delete_personality(self, messages=None):
            data = dict()
            if messages is not None:
                data["responses"] = messages

            self.delete(data=data, headers={"Authorization": self.__jwt_token,
                                            "Content-Type": "application/json"})
            return self.response_code, self.response_body
