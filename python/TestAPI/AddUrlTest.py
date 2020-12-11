import unittest
from os import path

from API.AddFaq import AddFaq
from Config import YAML_CONFIG
from Core.Assertions.Assertion import APIAssert
from Core.Base.BaseTest import BaseTest
from Core.DatabaseFactory.DatabaseType import DatabaseType
from Data.FAQs import FAQ_DATA_PATH, FAQ_URLS
from Utils.DataUtils import DataUtils
from Utils.DatabaseUtils import DatabaseHelper


class AddUrlTest(BaseTest):
    data = []
    EXCEPTION_ERROR = "Exception when execute API"
    ERROR_MISSING_FAQ_URL = "400: Bad Request: Missing faq url"

    __add_faq = AddFaq()
    __db_helper = DatabaseHelper(DatabaseType.MONGO_DB).database_query

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        data_path = path.join(FAQ_DATA_PATH, FAQ_URLS)
        self.data = DataUtils().get_data(file_name=data_path)

    @unittest.skip("Does not update verification function yet")
    def test_add_faq_successfully(self):
        self.__add_faq.add_new_faq(url=self.data[1][0])
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEquals,
                                  self.__add_faq.response_code,
                                  200),
            self.assert_container(self.assertEquals,
                                  self.__add_faq.get_value_in_json_response_body("knowledges")[0]["botId"],
                                  self.__add_faq.bot_id)
        )
        self.verify_faqs_created_in_database(bot_id=YAML_CONFIG.get("sample_app_bot_id"),
                                             url=self.data[1][0],
                                             expected_number_of_faqs=int(self.data[1][1]))

    def test_add_faq_unsuccessfully_with_blank_url(self):
        self.__add_faq.add_new_faq(url=None)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual,
                                  self.__add_faq.response_code,
                                  200),
            self.assert_container(self.assertEqual,
                                  self.ERROR_MISSING_FAQ_URL,
                                  self.__add_faq.get_value_in_json_response_body('error', True)['message'])
        )

    @unittest.skip("Does not update verification function yet")
    def test_add_ten_faqs_successfully(self):
        # TODO(minhhoang): urls.csv only has few url now. Update it
        len_of_data = len(self.data)
        for i in range(1, len_of_data):
            print("Test with URL: {}".format(self.data[i][0]))
            self.__add_faq.add_new_faq(url=self.data[i][0])
            APIAssert.should_run_api_successfully(
                self.assert_container(self.assertEquals,
                                      self.__add_faq.response_code,
                                      200),
                self.assert_container(self.assertEquals,
                                      self.__add_faq.get_value_in_json_response_body("knowledges")[0]["botId"],
                                      self.__add_faq.bot_id)
            )
            expected_number_of_this_faq_url = int(self.data[i][1]) if self.data[i][1] else None
            self.verify_faqs_created_in_database(bot_id=YAML_CONFIG.get("sample_app_bot_id"),
                                                 url=self.data[i][0],
                                                 expected_number_of_faqs=expected_number_of_this_faq_url)

    def verify_faqs_created_in_database(self, bot_id, url, expected_number_of_faqs=None):
        # TODO(minhhoang): Add wait
        print("Bot ID: {}".format(bot_id))
        print("URL: {}".format(url))
        list_faqs = self.__db_helper.get_list_item_in_collection(collection="Qna",
                                                                 filter_query={"botId": bot_id, "source": url})
        if expected_number_of_faqs is None:
            assert len(list_faqs) > 0, "There is no FAQ created from url {}".format(url)
        else:
            assert len(list_faqs) == expected_number_of_faqs, \
                "Expected {} FAQs from {} but created {} FAQs".format(expected_number_of_faqs, url, len(list_faqs))
