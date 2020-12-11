import hashlib
from Core.Base.BaseApi import BaseApi
from Utils.DataGenerateUtils import DataGenerateUtils as DataGenerate


class SignUp(BaseApi):

    def __init__(self):
        super().__init__("/auth/sign_up")
        self.__data = DataGenerate()
        self.__email = self.__data.create_email()
        self.__user_name = self.__data.create_name()
        self.__default_pass = "12345678"
        self.__jwt_token = None

    @property
    def jwt_token(self):
        return self.__jwt_token

    @property
    def default_user_email(self):
        return self.__email

    def create_new_user_account(self, username=None, email=None, password: str = None, zone_name="Asia/Saigon"):
        password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'', 100, 256).hex() if password else None
        self.post_data = {"username": username, "email": email,
                          "password": password, "zoneName": zone_name}
        self.post(data=self.post_data)
        return self.response_code, self.response_body

    def create_default_user_account(self):
        self.create_new_user_account(self.__user_name, self.__email, self.__default_pass)
        self.__jwt_token = "JWT " + self.get_value_in_json_response_body("jwtToken")
