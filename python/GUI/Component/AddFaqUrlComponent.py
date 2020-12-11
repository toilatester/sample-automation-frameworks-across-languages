from Core.Base.BaseComponent import BaseComponent
from selenium.webdriver.remote.webdriver import By


class AddFaqUrlComponent(BaseComponent):
    def __init__(self):
        BaseComponent.__init__(self, By.XPATH, "//form[contains(@class,'form knowledge-styles')]")
