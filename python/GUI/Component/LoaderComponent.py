from Core.Base.BaseComponent import BaseComponent
from selenium.webdriver.remote.webdriver import By


class LoaderComponent(BaseComponent):
    def __init__(self):
        BaseComponent.__init__(self, By.XPATH, "//div[contains(@class,'loader')]")
