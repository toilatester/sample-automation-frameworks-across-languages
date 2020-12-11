from ddt import ddt, data

from API.Personalities import Personalities
from Core.Base.BaseTest import BaseTest
from Core.Assertions.Assertion import APIAssert
import random
import string

LIST_WRONG_RESPONSE = [
    # Without responses field
    None,
    # Not an array
    "String",
    # Empty array
    [],
    # Not array of string ???
    # [123],
]

LIST_WRONG_INDEX = [
    # Without indexes field
    None,
    # Not an array
    1,
    # Not an array of number
    ["string"]
]


@ddt
class AddPersonalityTest(BaseTest):
    SUCCESS_CODE = 200
    BAD_REQUEST_CODE = 400
    invalid_param_code = 92

    __personality = Personalities()

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__personality.get_personalities()
        # Random an index of question to test
        index = random.randint(0, 11)
        self.__fixture_data = self.__personality.get_value_in_json_response_body("personalities")[index]
        self.__crud_personality = self.__personality.create_crud_endpoint_with_question_id(
            question_id=self.__fixture_data["id"])
        self.__init_data()

    def __init_data(self):
        self.list_wrong_responses = [
            # Without responses field
            None,
            # Not an array
            "String",
            # Empty array
            [],
            # Not array of string ???
            [123],
        ]
        self.list_wrong_index = [
            # Not an array
            1,
            # Not an array of number
            ["string"]
        ]

    def test_add_personality_successfully(self):
        random_message = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
        # Add new message
        self.__crud_personality.add_personality(responses=[random_message], indexes=[5])
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals, self.__crud_personality.response_code, 200),
            self.assert_container(
                self.assertEquals,
                self.__crud_personality.get_value_in_json_response_body("personality")["id"],
                self.__fixture_data["id"]
            ),
            self.assert_container(
                self.assertEquals,
                len(self.__crud_personality.get_value_in_json_response_body("personality")["responses"]),
                len(self.__fixture_data["responses"]) + 1
            ),
            self.assert_container(
                self.assertIn,
                random_message,
                self.__crud_personality.get_value_in_json_response_body("personality")["responses"]
            )
        )

    @data(*LIST_WRONG_RESPONSE)
    def test_add_personality_with_wrong_responses(self, responses):
        self.__crud_personality.add_personality(responses=responses, indexes=[1])
        self.verify_response_of_not_success()

    @data(*LIST_WRONG_INDEX)
    def test_add_personality_with_wrong_indexes(self, index):
        # indexes is not an array
        self.__crud_personality.add_personality(responses=["message"], indexes=index)
        self.verify_response_of_not_success()

    # TODO(namdoan): Update this validation function
    def verify_response_of_bad_request(self):
        # Verify status code
        actual_status_code = self.__crud_personality.response_code
        assert actual_status_code == self.BAD_REQUEST_CODE, \
            f"Expected status code {self.BAD_REQUEST_CODE} but {actual_status_code} is returned"
        # Verify if error object is returned
        assert isinstance(self.__crud_personality.get_value_in_json_response_body("error"), dict) is True, \
            "HTTP Responses does not contain error object"
        # Verify error code
        actual_error_code = self.__crud_personality.get_value_in_json_response_body("error")["code"]
        assert actual_error_code == self.invalid_param_code, \
            f"Expected status code {self.invalid_param_code} but {actual_error_code} is returned"

    def verify_response_of_not_success(self):
        actual_status_code = self.__crud_personality.response_code
        assert 400 <= actual_status_code < 600, f"Expect error response code but {actual_status_code} is returned"
        assert isinstance(self.__crud_personality.get_value_in_json_response_body("error"), dict) is True, \
            "HTTP Responses does not contain error object"

        actual_error_code = self.__crud_personality.get_value_in_json_response_body("error")["code"]
        assert actual_error_code == self.invalid_param_code, \
            f"Expected status code {self.invalid_param_code} but {actual_error_code} is returned"
