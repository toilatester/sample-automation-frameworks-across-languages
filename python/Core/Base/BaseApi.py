import os

import requests
from Utils.JSONUtils import JSONUtils
from Core.Helper.Constant import Constant
from Core.Exceptions.TestContextException import TestContextException


class BaseApi(object):
    def __init__(self, path="/"):
        self.path = path
        self.header = None
        self.post_data = None
        self.__response_body = None
        self.__response_code = None
        self.__get_api_url()

    @property
    def response_body(self):
        return self.__response_body.decode('utf-8')

    @property
    def response_code(self):
        return self.__response_code

    def post(self, data, headers=None, verify=False):
        self.__request(method=requests.post, data=data, headers=headers, verify=verify)

    def get(self, params=None, headers=None, verify=False):
        self.__request(method=requests.get, params=params, headers=headers, verify=verify)

    def put(self, data, headers=None, verify=False):
        self.__request(method=requests.put, data=data, headers=headers, verify=verify)

    def delete(self, data, headers=None, verify=False):
        self.__request(method=requests.delete, data=data, headers=headers, verify=verify)

    def __request(self, method, params=None, data=None, headers=None, verify=None):
        headers = {"Content-Type": "application/json"} if headers is None else headers
        response = method(url=self.__api_url, json=data, params=params, headers=headers,
                          verify=verify, timeout=Constant.REQUEST_TIMEOUT)
        self.__response_body = response.content
        self.__response_code = response.status_code

    def get_value_in_json_response_body(self, key, is_required_has_data=True):
        try:
            return JSONUtils.get_value_json_string(self.response_body, key)
        except Exception as e:
            if is_required_has_data:
                raise AssertionError("Response body does not contain {}".format(key))
            raise TestContextException("Has Error In Get Value With Key {}".format(key), e)

    def __get_api_url(self):
        host = os.getenv("API_HOST", Constant.API_HOST)
        protocol = os.getenv("API_PROTOCOL", Constant.API_PROTOCOL)
        is_start_with_protocol = host.startswith("http://") or host.startswith("https://")
        self.__host = host if is_start_with_protocol else protocol + "://" + host
        self.__api_url = self.__host + self.path
