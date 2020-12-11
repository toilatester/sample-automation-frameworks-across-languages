from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from Core.Base.BasePage import BasePage
from GUI.Component import AddFaqUrlComponent, LoaderComponent, FaqKnowledgeDataTableComponent
from Core.Config.SeleniumElement import ButtonElement, BaseElement, InputElement
from Core.Config.Service.ElementFinder import ElementFactory
from typing import List


class KnowledgePage(BasePage):

    def __init__(self):
        BasePage.__init__(self)
        self.__add_faq_url_component = AddFaqUrlComponent()
        self.__loader_component = LoaderComponent()
        self.__faq_knowledge_datatable_component = FaqKnowledgeDataTableComponent()

    timeout = 10
    add_url_knowledge_timeout = 300
    path_page = "/admin/setting_bot/knowledge"
    lbl_header_title = ElementFactory.get_element_until(by=By.CSS_SELECTOR, element_cls=BaseElement,
                                                        locator="h2.header",
                                                        wait_type=EC.visibility_of_element_located,
                                                        time_out=120)

    btn_add_knowledge = ElementFactory.get_element_until(element_cls=ButtonElement, by=By.XPATH,
                                                         locator="//div[contains(@class,'knowledge-styles') "
                                                                 "and @role='listbox']",
                                                         wait_type=EC.element_to_be_clickable,
                                                         time_out=30)

    btn_from_faq_url = ElementFactory.get_element_until(element_cls=ButtonElement, by=By.ID,
                                                        locator="optionAddFAQUrl",
                                                        wait_type=EC.element_to_be_clickable,
                                                        time_out=30)

    btn_from_faq_manual_qa = ElementFactory.get_element_until(element_cls=ButtonElement, by=By.ID,
                                                              locator="optionAddNewPairManually",
                                                              wait_type=EC.element_to_be_clickable,
                                                              time_out=30)

    btn_ok_add_faq_url = ElementFactory.get_element_until(element_cls=ButtonElement, by=By.ID,
                                                          locator="submit-url-button",
                                                          wait_type=EC.element_to_be_clickable,
                                                          time_out=30)

    btn_cancel_add_faq_url = ElementFactory.get_element_until(element_cls=ButtonElement, by=By.ID,
                                                              locator="cancel-process-button",
                                                              wait_type=EC.element_to_be_clickable,
                                                              time_out=30)

    txt_from_faq_url = ElementFactory.get_element_until(element_cls=InputElement, by=By.XPATH,
                                                        locator="//div[contains(@class,'knowledge-styles')]"
                                                                "//input[@placeholder='Enter a FAQ URL here']",
                                                        wait_type=EC.element_to_be_clickable,
                                                        time_out=30)

    def add_manual_faq_url(self, faq_url):
        self.__loader_component.wait_for_component_invisible()
        self.btn_add_knowledge.click()
        self.btn_from_faq_url.click()
        self.txt_from_faq_url.send_keys(faq_url)
        self.btn_ok_add_faq_url.click()

    def init_manual_question_pair_table(self):
        self.__loader_component.wait_for_component_invisible()
        self.btn_add_knowledge.click()
        self.btn_from_faq_manual_qa.click()
        self.__faq_knowledge_datatable_component.wait_for_manual_faq_section_visible()

    def add_question_answer_data(self, question, answer):
        self.__faq_knowledge_datatable_component.input_new_manual_question_pair(question, answer)

    def modify_question_answer_at_index(self, index, question, answer):
        self.__faq_knowledge_datatable_component.modify_question_pair_at_index(index, question, answer)

    def get_faq_url_data(self) -> List['str']:
        self.__add_faq_url_component.wait_for_component_remove()
        return self.__faq_knowledge_datatable_component.get_list_knowledge_title()

    def get_question_pair_data_in_gui(self):
        return self.__faq_knowledge_datatable_component.get_all_question_pair_data_in_table()

    def get_faq_url_data_in_gui(self, faq_url):
        self.__faq_knowledge_datatable_component.click_on_data_table_with_faq_url(faq_url)
        return self.__faq_knowledge_datatable_component.get_all_faq_data_in_table_with_faq_url(faq_url)

    # Work
    def wait_for_create_page(self, time_out=None):
        time_out = time_out if time_out is not None else self.timeout
        self.wait_for_page(self.path_page, time_out)
        self.lbl_header_title

    def wait_for_knowledge_section_visible(self, title):
        component = FaqKnowledgeDataTableComponent.get_table_component_with_group_faqs(title)
        component.wait_for_component_visible(self.add_url_knowledge_timeout)

    def open_knowledge_page(self):
        self.open_page(self.path_page)
