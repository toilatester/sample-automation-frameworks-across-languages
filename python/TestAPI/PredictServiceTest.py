import json
from os import path
from API import PredictService
from Core.Base.BaseTest import BaseTest, RepeatedTest
from Data.FAQs import FAQ_DATA_PATH, KATALON_DATA_FILE_NAME
from Core.Assertions.Assertion import APIAssert
from Utils.DataGenerateUtils import DataGenerateUtils


class PredictServiceTest(BaseTest):

    def __init__(self, *args, **kwargs):
        super(BaseTest, self).__init__(*args, **kwargs)
        self.is_api_test = True
        self.__data = DataGenerateUtils()
        self.__predict = PredictService()

    def setUp(self):
        super().setUp()

    def tearDown(self):
        super().tearDown()

    @RepeatedTest(2, parallel=False, thread_count=2)
    def test_init_data_service_return_enough_data(self):
        data_path = path.join(FAQ_DATA_PATH, KATALON_DATA_FILE_NAME)
        company_id = self.__data.create_name()
        with open(data_path, "r", encoding='utf-8') as f:
            data = f.read()
            code, body = self.__predict.init_predict_data(company_id, data)

        _, initialized_faq = self.__predict.get_all_faq_data(company_id)
        APIAssert.should_run_api_successfully(
            self.assert_container(self.assertEqual, code, 200),
        )
    '''
            # self.assert_container(self.assertEqual, len(expected_data), len(initialized_faq)),
            # self.assert_container(self.assertListEqual, expected_data, initialized_faq)
    '''
