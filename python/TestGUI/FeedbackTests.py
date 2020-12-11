import time

from ddt import ddt, data

from Core.Base.BaseIntegrationTest import BaseIntegrationTest

@ddt
class FeedbackTests(BaseIntegrationTest):
    FEEDBACK_TITLE = "DO YOU LIKE MY ANSWERS?"
    LIST_FEEDBACK_TEXT = ["IT'S GREAT", "IT'S GOOD", "IT'S OK", "IT'S BAD", "IT'S TERRIBLE"]
    NUMBER_OF_MESSAGES = 6
    IDLE_TIME = 200

    def __init__(self, *args, **kwargs):
        super(FeedbackTests, self).__init__(*args, **kwargs)
        self.__client_simulator = self._client_simulator

    def tearDown(self):
        super().tearDown()

    def setUp(self):
        super().set_up_website_integration()

    @data("Thanks", "Bye")
    def test_feedback_list_is_displayed_successfully_after_saying_end_sentences(self, value):
        self.verify_feedback_prerequisite()
        self.__client_simulator.send_message(value)
        self.verify_feedback_displayed_successfully()

    def test_feedback_list_is_hidden_when_users_continue_chatting(self):
        self.verify_feedback_prerequisite()
        self.__client_simulator.send_message("Bye Bye")
        self.__client_simulator.wait_for_feedback_returned()
        self.__client_simulator.send_message("New Message")
        self.assertTrue(self.__client_simulator.wait_for_feedback_returned() is False, "Feedback is not hidden.")

    def test_feedback_list_is_displayed_after_being_idle(self):
        self.verify_feedback_prerequisite()
        time.sleep(self.IDLE_TIME)
        self.verify_feedback_displayed_successfully()

    def verify_feedback_prerequisite(self):
        self.__client_simulator.create_stub_messages("Message", self.NUMBER_OF_MESSAGES)
        self.assertTrue(len(self.__client_simulator.get_responses()) >= self.NUMBER_OF_MESSAGES,
                        "Do not have enough messages to trigger feedback.")

    def verify_feedback_displayed_successfully(self):
        self.assertTrue(self.__client_simulator.wait_for_feedback_returned(), "Feedback is not triggered.")
        assert self.__client_simulator.get_feedback_title() == self.FEEDBACK_TITLE, \
            "Incorrect title : {0} != {1}".format(
                self.__client_simulator.get_feedback_title(), self.FEEDBACK_TITLE)
        self.assertListEqual(self.LIST_FEEDBACK_TEXT, self.__client_simulator.get_list_feedback_text(),
                             "Title of feedback is not correct {0} ! {1}".format(
                                 self.LIST_FEEDBACK_TEXT,
                                 self.__client_simulator.get_list_feedback_text()))
