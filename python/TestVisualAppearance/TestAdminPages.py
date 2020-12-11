from Core.Base.BaseTest import BaseTest
from GUI.POM.LoginPage.LoginPage import LoginPage
from GUI.POM.RegisterPage.RegisterPage import RegisterPage
from GUI.POM.CreateBotPage import CreateBotPage, CreateBotValidation
from GUI.POM.AppearancePage.ApperancePage import AppearancePage
from GUI.POM.ChangePassword.ChangePasswordPage import ChangePasswordPage
from GUI.POM.Dashboard.DashboardPage import DashboardPage
from GUI.POM.KnowledgePage.KnowledgePage import KnowledgePage
from GUI.Component.DropDownList import DropDownList
from GUI.Component.FaqKnowledgeDataTableComponent import FaqKnowledgeDataTableComponent
from Utils.DataGenerateUtils import DataGenerateUtils
from Utils.DataUtils import DataUtils
from applitools.eyes import Eyes, StitchMode
from selenium.webdriver.common.by import By
from Core.Config.SeleniumElement import SeleniumElement
from Config import YAML_CONFIG


class TestAdminPages(BaseTest):
    def __init__(self, *args, **kwargs):
        super(TestAdminPages, self).__init__(*args, **kwargs)
        self.__data = DataGenerateUtils()
        self.__login = LoginPage()
        self.__create_bot = CreateBotPage()
        self.__register = RegisterPage()
        self.__dashboard = DashboardPage()
        self.__appearance = AppearancePage()
        self.__create_bot_validation = CreateBotValidation()
        self.__drop_down_list = DropDownList()
        self.__change_password = ChangePasswordPage()
        self.__knowledge = KnowledgePage()
        self.__data_set = DataUtils()
        self.__faq_knowledge_data_table_component = FaqKnowledgeDataTableComponent()
        self.valid_email = self.__data.create_email()
        self.valid_username = self.__data.create_name()
        self.valid_password = self.__data.create_password()
        self.bot_name = "Test"
        self.invalid_faq = "google.com"
        self.eyes = Eyes()
        self.eyes.api_key = YAML_CONFIG.get("eyes_api_key")
        self.eyes.force_full_page_screenshot = True
        self.eyes.stitch_mode = StitchMode.CSS

    def setUp(self):
        super().setUp()
        self.sign_in_for_ui_test(
            email=YAML_CONFIG.get("visual_test_user"),
            password=YAML_CONFIG.get("visual_test_password"),
            # Use is_debugging flag to login instead of register new account
            is_debugging=True
        )

    def test_for_bot_knowledge_appearance(self):
        try:
            self.eyes.open(driver=self.__login.driver.core_driver,
                           app_name='sample_app',
                           test_name='Bot Knowledge Page',
                           viewport_size={'width': 1440, 'height': 887})
            self.__knowledge.open_knowledge_page()
            self.__knowledge.wait_for_create_page()
            # self.eyes.check_window("Default state of Knowledge Page")
            self.eyes.check_region_by_selector(By.XPATH, "//*[contains(@class,'two')]/div", "Default state")

            self.__knowledge.btn_add_knowledge.click()
            self.eyes.check_region_by_selector(by=By.CSS_SELECTOR, value="#add-knowledge-dropdown > div",
                                               tag="Add knowledge dropdown")

            self.__knowledge.btn_from_faq_url.click()
            # self.eyes.check_window("Knowledge page when adding faq url")
            self.eyes.check_region_by_selector(By.XPATH, "//*[contains(@class,'two')]/div", "Adding FAQ URL")

            self.__knowledge.init_manual_question_pair_table()
            # self.eyes.check_window("Knowledge page when init manual faq table")
            self.eyes.check_region_by_selector(By.XPATH, "//*[contains(@class,'two')]/div", "Initiated manual FAQ")

            manual_section = FaqKnowledgeDataTableComponent.get_table_component_with_group_faqs("Manual Q&A")
            manual_section.collapse_section()
            self.eyes.check_region_by_element(
                manual_section.base_component_element(SeleniumElement).get_wrapper_element,
                "Manual section after collapsing")

            web_content_section = FaqKnowledgeDataTableComponent.get_table_component_with_group_faqs("Web Content")
            web_content_section.open_section()
            # TODO(namndoan): capture full element
            self.eyes.check_region_by_element(
                web_content_section.base_component_element(SeleniumElement).get_wrapper_element,
                "Web content section after open")

            web_content_section.collapse_section()
            # self.eyes.check_window("Knowledge page after closing Web Content section")
            self.eyes.check_region_by_selector(By.XPATH, "//*[contains(@class,'two')]/div",
                                               "Closed Web Content section")
            self.eyes.check_region_by_selector(By.XPATH, "//*[contains(@class,'two')]/div[2]", "Chat box in knowledge")
        finally:
            res = self.eyes.close(raise_ex=True)
            print(res)
            self.eyes.abort_if_not_closed()

    def tearDown(self):
        super().tearDown()
