from Core.Base.BaseModel import BaseDataModel
from typing import List


class QnADataModel(BaseDataModel):
    class QnAInformation(object):
        def __init__(self, json_data):
            self.__qna = json_data

        @property
        def qna_information(self):
            return self.__qna

        @property
        def bot_id(self):
            return self.__qna['botId']

        @property
        def qna_question(self):
            return self.__qna['question']

        @property
        def qna_source(self):
            return self.__qna['source']

        @property
        def qna_answer(self):
            return self.__qna['answer']

    @property
    def get_all_qna_data(self) -> List['QnAInformation']:
        return self._get_all_item_in_collection('Qna', QnADataModel.QnAInformation)

    def get_qna_via_bot_id(self, bot_id) -> List['QnAInformation']:
        return self._get_all_item_with_filter('Qna', {"botId": bot_id}, QnADataModel.QnAInformation)

    def get_qna_via_source_link(self, source_link) -> List['QnAInformation']:
        return self._get_all_item_with_filter('Qna', {"source": source_link}, QnADataModel.QnAInformation)

    def get_qna_via_question(self, question) -> List['QnAInformation']:
        return self._get_all_item_with_filter('Qna', {"question": question}, QnADataModel.QnAInformation)

    def get_qna_via_qna_answer(self, answer) -> List['QnAInformation']:
        return self._get_all_item_with_filter('Qna', {"answer": answer}, QnADataModel.QnAInformation)

    def get_qna_via_qna_source_and_bot_id(self, source_link, bot_id) -> List['QnAInformation']:
        return self._get_all_item_with_filter('Qna', {"source": source_link, 'botId': bot_id},
                                              QnADataModel.QnAInformation)
