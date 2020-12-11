from Core.Base.BaseComponent import BaseComponent
from selenium.webdriver.remote.webdriver import By
from Core.Config.SeleniumElement import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from GUI.Component.SectionWithGroupFAQ import SectionWithGroupFAQ
from GUI.Component.SectionWithPairFAQ import SectionWithPairFAQ
from typing import List


class FaqKnowledgeDataTableComponent(BaseComponent):
    def __init__(self):
        BaseComponent.__init__(self, By.XPATH,
                               f"//div[contains(@class,'knowledge-styles') and contains(@class,'accordion')]")
        self.__manual_faq_section = SectionWithGroupFAQ('Manual Q&A')

    base_locator = "//div[contains(@class,'knowledge-styles') and contains(@class,'accordion')"
    lbl_knowledge_title = ".//div[contains(@class,'title')]"
    btn_add_pair = ".//*[@id='add-pair-button-1']"

    base_elements = ElementFactory.get_list_element(
        by=By.XPATH, locator=base_locator,
        element_cls=BaseElement
    )

    @staticmethod
    def get_table_component_with_group_faqs(section_name):
        return SectionWithGroupFAQ(section_name)

    @staticmethod
    def get_table_component_with_pair_faqs(section_name):
        return SectionWithPairFAQ(section_name)

    @staticmethod
    def get_number_of_section():
        return len(FaqKnowledgeDataTableComponent.base_elements)

    def get_list_knowledge_title(self) -> List['str']:
        list_knowledge_title = []
        for element in self.get_list_child_element_in_list_component(BaseElement, By.XPATH,
                                                                     self.lbl_knowledge_title):
            list_knowledge_title.append(element.get_attribute("innerText"))
        return list_knowledge_title

    def input_new_manual_question_pair(self, question: str, answer: str):
        self.__manual_faq_section.add_new_group(question, answer)

    def modify_question_pair_at_index(self, index, question, answer):
        # TODO(namndoan): Update this when question field become editable
        pass

    def click_on_data_table_with_faq_url(self, faq_url):
        section_for_faq_url = SectionWithGroupFAQ(faq_url)
        section_for_faq_url.open_section()

    def get_all_question_pair_data_in_table(self):
        self.__manual_faq_section.wait_for_component_visible()
        return self.__manual_faq_section.get_all_manual_faq()

    def get_all_faq_data_in_table_with_faq_url(self, faq_url):
        section_for_faq_url = SectionWithGroupFAQ(faq_url)
        section_for_faq_url.wait_for_component_visible()
        # Open the section if it is not active
        if not section_for_faq_url.is_active_section():
            section_for_faq_url.open_section()
        return section_for_faq_url.get_all_manual_faq()

    def wait_for_manual_faq_section_visible(self):
        return self.__manual_faq_section.wait_for_component_visible()

    def get_number_of_manual_pair(self) -> str:
        return self.__manual_faq_section.get_section_info()["length"]
