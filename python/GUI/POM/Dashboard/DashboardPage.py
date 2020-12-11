from GUI.Component.LoaderComponent import LoaderComponent
from Core.Base.BasePage import BasePage


class DashboardPage(BasePage):
    timeout = 10
    path_page = "/admin/dashboard"

    def __init__(self):
        self.__loader_component = LoaderComponent()

    @property
    def txt_header_text(self):
        return "Summary"

    def open_dashboard_page(self):
        self.open_page(self.path_page)

    def wait_for_dashboard_page(self):
        self.wait_for_page(path=self.path_page, timeout=self.timeout)
