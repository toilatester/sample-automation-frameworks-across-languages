from typing import List

from Core.Base.BaseValidation import BaseValidation
from Core.DatabaseFactory.DatabaseType import DatabaseType
from Model.Bot import BotDataModel
from Model.QnA import QnADataModel
from Utils.DatabaseUtils import DatabaseHelper
from .KnowledgePage import KnowledgePage


class KnowledgeValidation(BaseValidation):
    def __init__(self):
        BaseValidation.__init__(self)
        self.__db_helper = DatabaseHelper(DatabaseType.MONGO_DB).database_query
        self.__knowledge = KnowledgePage()
        self.__bot = BotDataModel()
        self.__qna = QnADataModel()

    def should_added_faq_url_successfully(self, actual_url: List['str'], expect_url: str):
        self.assertion.should_contain_in_list(actual_url, expect_url, "Has error in add FAQ url")

    def should_added_correctly_url_data(self, bot_name, actual_data):
        bots: List['BotDataModel.BotInformation'] = self.__bot.get_bots_via_bot_name(bot_name)
        list_qna: List[QnADataModel.QnAInformation] = self.__qna.get_qna_via_bot_id(bots[0].bot_id)
        expected_data = []
        for qna in list_qna:
            expected_data.append({"questions": [qna.qna_question], "answer": qna.qna_answer})
        self.assertion.should_be_equal(expected_data, actual_data,
                                       "Has difference in faq data \nExpected: {} \nActual: {} ".format(expected_data,
                                                                                                        actual_data))

    def should_create_question_pair_table_with_empty_data(self):
        # It seem to get the first table without check if it is Manual Q&A table
        data_table = self.__knowledge.get_question_pair_data_in_gui()
        print(f"Data table {data_table}")
        is_has_data = lambda input_length: len(input_length) > 0
        data_table = [data_row for data_row in data_table if
                      is_has_data(data_row["questions"])]
        self.assertion.should_be_equal(len(data_table), 0, "Init new question pair with existing data")
