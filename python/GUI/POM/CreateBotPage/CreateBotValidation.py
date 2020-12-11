import time

from selenium.webdriver.support.wait import WebDriverWait

from Core.DatabaseFactory.DatabaseType import DatabaseType
from GUI.Component.BottomLeftNotification import BottomLeftNotification
from GUI.Component.DropDownList import DropDownList
from GUI.NotificationMessages import NotificationMessages
from Utils.DatabaseUtils import DatabaseHelper
from .CreateBotPage import CreateBotPage

timeout_create_bot = 300


class CreateBotValidation(object):
    def __init__(self):
        self.__db_helper = DatabaseHelper(DatabaseType.MONGO_DB).database_query
        self.__create_page = CreateBotPage()
        self.__drop_down_list = DropDownList()
        self.__bottom_left_noti = BottomLeftNotification()

    def should_init_correct_total_faq_questions(self, user_email, bot_name):
        bot_info: dict = self.__create_page.get_bot_data_via_user_email_and_bot_name(user_email, bot_name)

        def wait_func(_):
            # Recheck after 5 seconds
            time.sleep(3)
            create_page = CreateBotPage()
            list_question = create_page.get_list_question_via_bot_id(bot_info.get("botId"))
            return len(list_question) > 1

        WebDriverWait(driver=self.__create_page.driver.core_driver, timeout=60) \
            .until(method=wait_func,
                   message="There is no FAQs initialized")

    def should_init_correct_question_data(self):
        # TODO(minhhoang): Fulfill
        pass

    def new_bot_should_be_current_selected_bot(self, bot_name, website):
        assert self.__drop_down_list.current_bot_info() == self.__drop_down_list.get_expected_full_name(bot_name,
                                                                                                        website), \
            "New bot is not current selected bot"

    def wait_and_verify_notification_message(self, message=NotificationMessages.initial_knowledge_success_message):
        self.__bottom_left_noti.wait_for_component_present(timeout_create_bot)
        self.__bottom_left_noti.wait_for_component_visible()
        actual_bot_left_message = self.__bottom_left_noti.get_message()
        assert actual_bot_left_message == message, \
            f"Expect bottom left noti '{message}' but '{actual_bot_left_message}' found "
