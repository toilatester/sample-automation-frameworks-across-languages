from os import path

GUI_DATA_PATH = path.dirname(path.abspath(__file__))
INVALID_LOGIN_DATA = path.join(GUI_DATA_PATH, "invalid_accounts_for_login.csv")
INVALID_REGISTER_DATA = path.join(GUI_DATA_PATH, "invalid_accounts_for_register.csv")
INVALID_BOT_INFO_DATA = path.join(GUI_DATA_PATH, "invalid_bot_infos.csv")
STUB_MANUAL_FAQ_DATA = path.join(GUI_DATA_PATH, "stub_manual_faq_url.csv")
INVALID_DATA_FOR_CHANGE_PASSWORD = path.join(GUI_DATA_PATH, "invalid_data_for_change_password.csv")
INVALID_DATA_FOR_FORGOT_PASSWORD = path.join(GUI_DATA_PATH, "invalid_data_for_forgot_password.csv")
