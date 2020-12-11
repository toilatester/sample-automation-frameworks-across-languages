from Core.Base.BaseComponent import BaseComponent
from selenium.webdriver.remote.webdriver import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException, ElementNotVisibleException
from Core.Config.SeleniumElement import BaseElement
from Core.Config.Service.ElementFinder import ElementFactory
from selenium.webdriver.remote.webelement import WebElement
from typing import List


class SectionWithGroupFAQ(BaseComponent):
    def __init__(self, section_name):
        BaseComponent.__init__(self, By.XPATH,
                               f"//div[contains(@class,'knowledge-styles') and contains(@class,'accordion')"
                               f" and .//*[normalize-space(text())='{section_name}']]")

    base_locator = "//div[contains(@class,'knowledge-styles') and contains(@class,'accordion')]"
    lbl_knowledge_title = ".//div[contains(@class,'title')]"  # /div
    btn_add_pair = ".//*[contains(@id,'add-pair-button')]"
    input_question_of_new_group = ".//div[@placeholder='Type a question']"
    input_answer_of_new_group = "//div[@placeholder='Type a question']/" \
                                "ancestor::tr//div[@placeholder='Type an answer']"
    tfoot_tag_name = "tfoot"
    div_header = ".//div[contains(@class,'title')]"
    row_contains_answer = ".//tr//div[@placeholder='Type an answer' and .='{0}']/ancestor::tr"
    row_contains_question = ".//tr/td[1]//span[.='{0}']/ancestor::tr"

    base_elements = ElementFactory.get_list_element(
        by=By.XPATH, locator=base_locator,
        element_cls=BaseElement
    )

    def get_section_info(self):
        lbl_title = self.get_list_child_element(BaseElement, By.XPATH, self.lbl_knowledge_title)

        result = {
            "title": lbl_title[0].text,
            "length": lbl_title[1].text
        }
        return result

    def is_active_section(self):
        title = self.get_child_element(BaseElement, By.XPATH, ".//div[contains(@class,'title')]")
        class_name = title.get_attribute('class')
        return ' active ' in f" {class_name} "

    def open_section(self):
        self.base_component_element(BaseElement).click()

    def collapse_section(self):
        self.get_child_element(BaseElement, By.XPATH, self.div_header).click()

    def add_new_group(self, first_question, answer):
        try:
            self.get_child_element(BaseElement, By.XPATH, self.btn_add_pair).click()
        except NoSuchElementException:
            pass
        except ElementNotVisibleException:
            pass
        self.get_child_element(BaseElement, By.XPATH, self.input_question_of_new_group).send_keys(first_question)
        self.get_child_element(BaseElement, By.XPATH, self.input_answer_of_new_group).send_keys(answer)
        self.get_child_element(BaseElement, By.TAG_NAME, self.tfoot_tag_name).click()
        # time.sleep(1)

    def add_similar_question(self, answer, similar_question):
        row = self.find_row_element(answer=answer)
        btn_locator = ".//*[contains(@id,'add-similar-question')]/preceding-sibling::span"
        input_locator = ".//div[@placeholder='Type similar question']"
        # Find button add similar question
        btn_add_similar_question = self.get_child_element_if_exist(locator_type=By.XPATH, locator_value=btn_locator,
                                                                   parent_element=row)
        # Click on button add similar question if it exist
        (btn_add_similar_question is not None) and btn_add_similar_question.click()
        # Enter similar question
        row.find_element_by_xpath(input_locator).send_keys(similar_question)
        row.find_element_by_xpath(input_locator).send_keys(Keys.ENTER)

    def get_all_manual_faq(self) -> [dict]:
        result = []
        for row in self.find_all_row_element():
            questions = self.__get_all_similar_question_in_row(row)
            if len(questions) > 0:
                answer = row.find_element_by_xpath(".//div[@placeholder='Type an answer']").text
                result.append({"questions": questions, "answer": answer})
        return result

    def get_list_similar_question(self, answer):
        row = self.find_row_element(answer=answer)
        return self.__get_all_similar_question_in_row(row)

    def __get_all_similar_question_in_row(self, row: WebElement):
        result = []
        locator = "./td[1]/div[1]//span[@draggable]"
        similar_questions = row.find_elements_by_xpath(locator)
        for question in similar_questions:
            result.append(question.text)
        return result

    def find_row_element(self, answer=None, question=None) -> WebElement:
        if answer is not None:
            return self.get_child_element(
                BaseElement,
                By.XPATH,
                self.row_contains_answer.format(answer)
            )
        elif question is not None:
            return self.get_child_element(BaseElement, By.XPATH,
                                          self.row_contains_question.format(question))
        else:
            raise Exception("Missing both answer and question")

    def find_all_row_element(self) -> List[WebElement]:
        return self.get_list_child_element(BaseElement, By.XPATH, ".//tbody//tr")
