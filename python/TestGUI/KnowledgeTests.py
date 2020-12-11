from Config import YAML_CONFIG
from Core.Base.BaseTest import BaseTest
from Core.Exceptions.TestContextException import TestContextException
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.POM.KnowledgePage import KnowledgePage, KnowledgeValidation
from GUI.POM.Dashboard.DashboardPage import DashboardPage
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils


class KnowledgeFeatureTests(BaseTest):
    def __init__(self, *args, **kwargs):
        super(KnowledgeFeatureTests, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__appearance = AppearancePage()
        self.__knowledge_validation = KnowledgeValidation()
        self.__dashboard = DashboardPage()
        self.__knowledge = KnowledgePage()
        self.__data_set = DataUtils()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.faq_url = YAML_CONFIG.get("stub_manual_faq_url")
        self.invalid_faq = YAML_CONFIG.get("stub_invalid_faq_url")

    def setUp(self):
        super().setUp()
        self.bot_name = self.__data.create_uuid_number()
        self.setUpMethod()

    def setUpMethod(self):
        try:
            self.sign_in_for_ui_test(self.valid_username, self.valid_email, self.valid_password,
                                     self.bot_name, self.invalid_faq, False)
            self.__knowledge.open_page(self.__knowledge.path_page)
        except Exception as e:
            raise TestContextException(e)

    def test_add_manual_faq_successfully(self):
        self.__knowledge.wait_for_create_page(30)
        self.__knowledge.add_manual_faq_url(self.faq_url)

        self.__knowledge.wait_for_knowledge_section_visible(self.faq_url)
        self.__knowledge_validation.should_added_correctly_url_data(self.bot_name,
                                                                    self.__knowledge.get_faq_url_data_in_gui(
                                                                        self.faq_url))

    def test_add_manual_question_pair_successfully(self):
        question = "Test with question sample"
        answer = "Test with answer sample"
        self.__knowledge.wait_for_create_page(30)
        self.__knowledge.init_manual_question_pair_table()
        self.__knowledge_validation.should_create_question_pair_table_with_empty_data()

        self.__knowledge.add_question_answer_data(question, answer)

        knowledge = self.__knowledge.get_question_pair_data_in_gui()
        assert len(knowledge) == 1, \
            f"Expect 1 pair is added but {len(knowledge)} is displayed"
        assert knowledge[0]["answer"] == answer, \
            f"{answer} is added but {knowledge[0]['answer']} is displayed"
        assert len(knowledge[0]["questions"]) == 1, \
            f"Expect that there is 1 question but {len(knowledge[0]['question'])}"
        assert knowledge[0]["questions"][0] == question, f"Added question is different with input"
