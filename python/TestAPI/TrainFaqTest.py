from API.TrainFaq import TrainFaq
from Core.Base.BaseTest import BaseTest


class TrainFaqTest(BaseTest):
    UNAUTHORIZED_MESSAGE = "UNAUTHORIZED or EXPIRED"
    UNAUTHORIZED_CODE = 401
    FORBIDDEN_CODE = 403
    SUCCESS_CODE = 200

    __train_faq = TrainFaq()

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True

    def test_train_faq_successfully(self):
        # TODO(minhhoang): Should add knowledge before train
        self.__train_faq.train_faqs_with_jwt_token()
        assert self.__train_faq.response_code == self.SUCCESS_CODE, str(
            self.__train_faq.response_code) + str(self.__train_faq.response_body)
        self.verify_all_faqs_are_trained()

    def test_train_faq_unsuccessfully_by_unauthorized(self):
        self.__train_faq.train_faqs_without_jwt_token()
        assert self.__train_faq.response_code == self.FORBIDDEN_CODE
        assert self.UNAUTHORIZED_MESSAGE == self.__train_faq.get_value_in_json_response_body("error")["message"]

    def verify_all_faqs_are_trained(self):
        number_of_pending_faqs = self.__train_faq.get_number_of_pending_faqs()
        assert number_of_pending_faqs == 0, "{} FAQ(s) are still not be trained.".format(number_of_pending_faqs)
