from Core.Base.BaseComponent import BaseComponent
from selenium.webdriver.common.by import By

class SectionWithPairFAQ(BaseComponent):
    """
    Sub Component for section which only contains pairs of Question and Answer
    """

    def __init__(self, section_name):
        BaseComponent.__init__(self, By.XPATH,
                               f"//div[contains(@class,'knowledge-styles') and contains(@class,'accordion')"
                               f" and .//*[normalize-space(text())='{section_name}']]")
