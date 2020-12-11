from ddt import ddt, data

from Core.Base.BaseTest import BaseTest
from API.Personalities import Personalities
from Core.Assertions.Assertion import APIAssert
import random

INVALID_RESPONSE = [
    # Without response
    None,
    # Empty response
    "",
    # Empty array
    [],
    # Not an array
    "!Array",
]


@ddt
class DeletePersonalityTest(BaseTest):
    SUCCESS_CODE = 200
    BAD_REQUEST_CODE = 400
    INTERNAL_SERVER_ERROR = 500

    MINIMUM_NUMBER_OF_ANSWERS_OF_DELETABLE_PERSONALITY = 2

    invalid_param_code = 112

    __personality = Personalities()

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__personality.get_personalities()
        # Select a question randomly which contains at least 2 responses
        self.__fixture_data = []
        while self.__fixture_data == [] \
                or len(self.__fixture_data["responses"]) < self.MINIMUM_NUMBER_OF_ANSWERS_OF_DELETABLE_PERSONALITY:
            index = random.randint(0, 11)
            self.__fixture_data = self.__personality.get_value_in_json_response_body("personalities")[index]
        self.__crud_personality = self.__personality.create_crud_endpoint_with_question_id(
            question_id=self.__fixture_data["id"])

    def xtest_delete_non_default_response_successfully(self):
        response = self.get_a_random_response_in_fixture_data()
        self.__crud_personality.delete_personality([response])
        assert self.__crud_personality.response_code == self.SUCCESS_CODE, \
            f"Expect status code {self.SUCCESS_CODE} but {self.__crud_personality.response_code} is returned"
        returned_personality_object = self.__crud_personality.get_value_in_json_response_body("personality")
        assert isinstance(returned_personality_object, dict) is True, \
            "HTTP response does not contains personality object"
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals,
                                  returned_personality_object["id"],
                                  self.__fixture_data["id"]),
            self.assert_container(self.assertEquals,
                                  len(returned_personality_object["responses"]),
                                  len(self.__fixture_data["responses"]) - 1),
            self.assert_container(self.assertNotIn,
                                  response,
                                  returned_personality_object["responses"]),
            self.assert_container(self.assertEquals,
                                  returned_personality_object["defaultResponse"],
                                  self.__fixture_data["defaultResponse"])
        )

    def xtest_delete_default_response_successfully(self):
        current_default_response = self.__fixture_data["defaultResponse"]
        self.__crud_personality.delete_personality([current_default_response])
        assert self.__crud_personality.response_code == self.SUCCESS_CODE, \
            f"Expect status code {self.SUCCESS_CODE} but {self.__crud_personality.response_code} is returned"
        returned_personality_object = self.__crud_personality.get_value_in_json_response_body("personality")
        assert isinstance(returned_personality_object, dict) is True, \
            "HTTP response does not contain personality object"
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals,
                                  returned_personality_object["id"],
                                  self.__fixture_data["id"]),
            self.assert_container(self.assertEquals,
                                  len(returned_personality_object["responses"]),
                                  len(self.__fixture_data["responses"]) - 1),
            self.assert_container(self.assertNotIn,
                                  current_default_response,
                                  returned_personality_object["responses"]),
            # Check if response at index 1 become default one
            self.assert_container(self.assertEquals,
                                  returned_personality_object["defaultResponse"],
                                  self.__fixture_data["responses"][1])
        )

    @data(*INVALID_RESPONSE)
    def test_delete_personality_with_invalid_response(self, responses):
        self.__crud_personality.delete_personality(responses)
        assert self.__crud_personality.response_code == self.BAD_REQUEST_CODE, \
            f"Expect status code {self.BAD_REQUEST_CODE} but {self.__crud_personality.response_code} is returned"
        returned_error_object = self.__crud_personality.get_value_in_json_response_body("error", True)
        assert isinstance(returned_error_object, dict) is True, "HTTP response does not contain error object"
        assert returned_error_object["code"] == self.invalid_param_code, \
            f"Expect error code {self.invalid_param_code} but {returned_error_object['code']} is found"
        # Check that above calling deletes no response
        self.verify_fixture_data_has_no_change()

    def xtest_delete_all_response_in_a_question(self):
        self.__crud_personality.delete_personality(self.__fixture_data["responses"])
        assert self.__crud_personality.response_code == self.INTERNAL_SERVER_ERROR, \
            f"Expect status code {self.INTERNAL_SERVER_ERROR} but {self.__crud_personality.response_code} is returned"

        returned_error_object = self.__crud_personality.get_value_in_json_response_body("error")
        assert isinstance(returned_error_object, dict) is True, "HTTP response does not contain error object"

        assert returned_error_object["code"] == 0, f"Expect error code {0} but {returned_error_object['code']} is found"
        # Verify that above calling deletes no response
        self.verify_fixture_data_has_no_change()

    def xget_a_random_response_in_fixture_data(self, include_default=False):
        start_index = 0 if include_default else 1
        index = random.randint(start_index, len(self.__fixture_data["responses"]) - 1)
        return self.__fixture_data["responses"][index]

    def verify_fixture_data_has_no_change(self):
        self.__personality.get_personalities()
        assert self.__fixture_data in self.__personality.get_value_in_json_response_body("personalities"), \
            "Fixture data has been changed"
