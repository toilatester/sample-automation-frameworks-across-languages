import os
import json
from Core.Base.BaseApi import BaseApi
from Config import YAML_CONFIG, PROTOCOL


class PredictService(BaseApi):
    def __init__(self):
        super().__init__()
        os.environ['API_HOST'] = PROTOCOL + "://" + YAML_CONFIG.get("predict_host")
        os.environ['API_PROTOCOL'] = PROTOCOL
        self.__init_data = PredictService.PredictInitData()
        self.__predict = PredictService.PredictGetAnswer()
        self.__faq_data = PredictService.PredictGetAllData()

    @property
    def init_api(self):
        return self.__init_data

    @property
    def predict_api(self):
        return self.__predict

    def init_predict_data(self, company_id, faqs_data):
        self.__init_data.init_faqs_data(company_id, faqs_data)
        return self.__init_data.response_code, json.loads(self.__init_data.response_body)

    def get_all_faq_data(self, company_id):
        return self.__faq_data.get_all_faqs(company_id)

    def predict_question(self, company_id, question_data):
        self.__predict.predict_question(company_id, question_data)
        return self.__predict.response_code, json.loads(self.__predict.response_body)

    class PredictInitData(BaseApi):
        def __init__(self):
            super().__init__("/faqs/create")

        def init_faqs_data(self, company_id, faqs_data):
            self.post_data = {"company_id": company_id,
                              "faqs": json.loads(faqs_data)}
            self.post(data=self.post_data)
            return self.response_code, self.response_body

    class PredictGetAnswer(BaseApi):
        def __init__(self):
            super().__init__("/predict")

        def predict_question(self, company_id, question_data):
            self.post_data = {"company_id": company_id,
                              "question": question_data}
            self.post(data=self.post_data)
            return self.response_code, self.response_body

    class PredictGetAllData(BaseApi):
        def __init__(self):
            super().__init__("/faqs/all")

        def get_all_faqs(self, company_id):
            self.post_data = {"company_id": company_id}
            self.post(data=self.post_data)
            return self.response_code, json.loads(self.response_body)
