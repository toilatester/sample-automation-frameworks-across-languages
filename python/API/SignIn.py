import hashlib
from Core.Base.BaseApi import BaseApi
from Config import YAML_CONFIG


class SignIn(BaseApi):
    def __init__(self):
        super().__init__("/auth/sign_in")
        self.__jwt_token = None

    @property
    def jwt_token(self):
        return self.__jwt_token

    def sign_in(self, email=None, password=None, is_remember_me=True):
        password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'', 100, 256).hex() if password else None
        self.post_data = {"email": email,
                          "password": password,
                          "isRememberMe": is_remember_me}
        self.post(data=self.post_data)
        return self.response_code, self.response_body

    def sign_in_without_email(self, password=None, is_remember_me=True):
        password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), b'', 100, 256).hex() if password else None
        self.post_data = {
            "password": password,
            "isRememberMe": is_remember_me}
        self.post(data=self.post_data)
        return self.response_code, self.response_body

    def sign_in_without_pass(self, email=None, is_remember_me=True):
        self.post_data = {"email": email,
                          "isRememberMe": is_remember_me}
        self.post(data=self.post_data)
        return self.response_code, self.response_body

    def sign_in_with_invalid_pass(self, email=None, password=None, is_remember_me=True):
        self.post_data = {"email": email,
                          "password": password,
                          "isRememberMe": is_remember_me}
        self.post(data=self.post_data)
        return self.response_code, self.response_body

    # For quick use to get the token
    def sign_in_successfully(self, email=YAML_CONFIG.get("sample_app_user"), password=YAML_CONFIG.get("sample_app_pass")):
        self.post_data = {"email": email,
                          "password": password}
        self.post(data=self.post_data)
        token = self.get_value_in_json_response_body("jwtToken")
        self.__jwt_token = f'JWT {token}'
        return self.response_code, self.response_body
