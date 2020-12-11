from API.SignUp import SignUp
from Core.Base.BaseApi import BaseApi
from Core.DatabaseFactory.DatabaseType import DatabaseType
from Utils.DatabaseUtils import DatabaseHelper
from Utils.JSONUtils import JSONUtils


class CreateBot(BaseApi):

    def __init__(self):
        super().__init__("/bot/create")
        self.__bot_id = None
        self.__database = DatabaseHelper(DatabaseType.MONGO_DB).database_query
        self.__sign_up = SignUp()
        self.__get_token_by_sign_up()

    @property
    def default_user_email(self):
        return self.__sign_up.default_user_email

    @property
    def bot_id(self):
        return self.__bot_id

    @property
    def jwt_token(self):
        return self.__sign_up.jwt_token

    def __get_token_by_sign_up(self):
        self.__sign_up.create_default_user_account()

    def create_new_bot(self, bot_website_url=None, bot_name=None, zone_name="Asia/Saigon", jwt_token=None):
        jwt_token = jwt_token if jwt_token is not None else self.__sign_up.jwt_token
        self.post_data = {"botWebsite": bot_website_url,
                          "botName": bot_name,
                          "zoneName": zone_name
                          }
        self.post(data=self.post_data,
                  headers={"Authorization": jwt_token, "Content-Type": "application/json"})
        return self.response_code, self.response_body

    def create_default_bot(self):
        self.post_data = {"botWebsite": "http://www.google.com",
                          "botName": "default_bot_add_faq_auto",
                          "zoneName": "Asia/Saigon"
                          }
        self.post(data=self.post_data,
                  headers={"Authorization": self.jwt_token, "Content-Type": "application/json"})
        self.__bot_id = JSONUtils.get_value_json_string(self.response_body, "botInfo")['id']
        return self.response_code, self.response_body

    def get_bot_data_in_db(self, user_email):
        return self.__database.get_item_in_collection("Bot", {"creators.email": user_email})
