from ddt import ddt, data

from Core.Base.BaseTest import BaseTest
from API.Personalities import Personalities
from Core.Assertions.Assertion import APIAssert
import random
import string

INVALID_OLD_RESPONSE = [
    # Not a string
    123,
    # Not a string
    [],
    # Not existed old response
    ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
]

EMPTY_RESPONSES = [
    # Without old response
    None,
    # Empty old response
    ""
]

INVALID_NEW_RESPONSES = [
    # Not a string
    123,
    # Not a string
    []
]


@ddt
class UpdatePersonalityTest(BaseTest):
    SUCCESS_CODE = 200
    BAD_REQUEST_CODE = 400
    INTERNAL_SERVER_ERROR = 500
    # Case None + ""
    missing_param_code = 102
    # Case 123, [], "random"
    invalid_param_code = 0
    __personality = Personalities()

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__personality.get_personalities()
        # Random an index of question to test
        self.__fixture_data = []
        while self.__fixture_data == [] or len(self.__fixture_data["responses"]) < 2:
            index = random.randint(0, 11)
            self.__fixture_data = self.__personality.get_value_in_json_response_body("personalities")[index]
        self.__crud_personality = self.__personality.create_crud_endpoint_with_question_id(
            question_id=self.__fixture_data["id"])

    def test_update_personality_with_default_response_successfully(self):
        # Get default response at index 0
        old_response = self.__fixture_data["responses"][0]
        new_response = self.random_a_new_string()
        self.__crud_personality.update_personality(old_response, new_response)

        returned_personality_object = self.__crud_personality.get_value_in_json_response_body("personality")
        self.verify_status_code_is(self.SUCCESS_CODE)
        assert isinstance(returned_personality_object, dict), \
            f"HTTP response does not contain personality object"
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals,
                                  returned_personality_object["id"],
                                  self.__fixture_data["id"]
                                  ),
            self.assert_container(self.assertEquals,
                                  len(returned_personality_object["responses"]),
                                  len(self.__fixture_data["responses"])),
            self.assert_container(self.assertIn,
                                  new_response,
                                  returned_personality_object["responses"]),
            self.assert_container(self.assertNotIn,
                                  old_response,
                                  returned_personality_object["responses"]),
            self.assert_container(self.assertEquals,
                                  new_response,
                                  returned_personality_object["defaultResponse"])
        )

    def test_update_personality_with_non_default_response_successfully(self):
        old_response = self.get_a_random_response_in_fixture_data()
        new_response = self.random_a_new_string()
        self.__crud_personality.update_personality(old_response, new_response)

        returned_personality_object = self.__crud_personality.get_value_in_json_response_body("personality")
        self.verify_status_code_is(self.SUCCESS_CODE)
        assert isinstance(self.__crud_personality.get_value_in_json_response_body("personality"), dict) is True, \
            f"HTTP response does not contains personality object"
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals,
                                  returned_personality_object["id"],
                                  self.__fixture_data["id"]),
            self.assert_container(self.assertEquals,
                                  len(returned_personality_object["responses"]),
                                  len(self.__fixture_data["responses"])),
            self.assert_container(self.assertIn,
                                  new_response,
                                  returned_personality_object["responses"]),
            self.assert_container(self.assertNotIn,
                                  old_response,
                                  returned_personality_object["responses"]),
            self.assert_container(self.assertEquals,
                                  returned_personality_object["defaultResponse"],
                                  self.__fixture_data["defaultResponse"])
        )

    @data(*INVALID_OLD_RESPONSE)
    def test_update_personality_with_invalid_old_response(self, old_response):
        new_response = self.random_a_new_string()
        self.__crud_personality.update_personality(old_response, new_response)
        self.verify_status_code_is(self.INTERNAL_SERVER_ERROR)
        self.verify_error_code_in_response_is(self.invalid_param_code)
        self.verify_fixture_data_has_no_change()

    @data(*EMPTY_RESPONSES)
    def test_update_personality_with_empty_old_response(self, old_response):
        new_response = self.random_a_new_string()
        self.__crud_personality.update_personality(old_response=old_response, new_response=new_response)
        self.verify_status_code_is(self.BAD_REQUEST_CODE)
        self.verify_error_code_in_response_is(self.missing_param_code)
        self.verify_fixture_data_has_no_change()

    @data(*INVALID_NEW_RESPONSES)
    def test_update_personality_with_invalid_new_response(self, new_response):
        old_response = self.get_a_random_response_in_fixture_data()
        self.__crud_personality.update_personality(old_response, new_response)
        self.verify_status_code_is(self.INTERNAL_SERVER_ERROR)
        self.verify_error_code_in_response_is(self.missing_param_code)
        self.verify_fixture_data_has_no_change()

    @data(*EMPTY_RESPONSES)
    def test_update_personality_with_empty_new_response(self, new_response):
        old_response = self.get_a_random_response_in_fixture_data()
        self.__crud_personality.update_personality(old_response, new_response)
        self.verify_status_code_is(self.BAD_REQUEST_CODE)
        self.verify_error_code_in_response_is(self.missing_param_code)
        self.verify_fixture_data_has_no_change()

    def verify_status_code_is(self, expected_status_code):
        assert self.__crud_personality.response_code == expected_status_code, \
            f"Expect status code {expected_status_code} but {self.__crud_personality.response_code} is returned"

    def verify_error_code_in_response_is(self, expected_error_code):
        assert isinstance(self.__crud_personality.get_value_in_json_response_body("error"), dict) is True, \
            "HTTP Responses does not contain error object"
        actual_error_code = self.__crud_personality.get_value_in_json_response_body("error")["code"]
        assert actual_error_code == expected_error_code, \
            f"Expected status code {expected_error_code} but {actual_error_code} is returned"

    def verify_fixture_data_has_no_change(self):
        # Get new personalities info
        self.__personality.get_personalities()
        assert self.__fixture_data in self.__personality.get_value_in_json_response_body("personalities"), \
            "Fixture data has been changed"

    def get_a_random_response_in_fixture_data(self, include_default=False):
        start_index = 0 if include_default else 1
        index = random.randint(start_index, len(self.__fixture_data["responses"]) - 1)
        return self.__fixture_data["responses"][index]

    def random_a_new_string(self, length=20):
        return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))
