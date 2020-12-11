from os import path
from Core.Exceptions.TestContextException import TestContextException
from Core.Helper.Singleton import Singleton
import yaml


class _Configuration(metaclass=Singleton):
    def __init__(self):
        self.__yaml_config: dict = self.__read_yaml_file_config()

    @property
    def base_url(self):
        return self.__yaml_config.get("base_url")

    @property
    def browser(self):
        return self.__yaml_config.get("browser")

    @property
    def api_url(self):
        return self.__yaml_config.get("api_url")

    @property
    def gui_url(self):
        return self.__yaml_config.get("gui_url")

    @property
    def protocol(self):
        return self.__yaml_config.get("protocol")

    @property
    def timeout(self):
        return self.__yaml_config.get("request_timeout")

    @property
    def yaml(self) -> dict:
        return self.__yaml_config


    def __read_yaml_file_config(self):
        try:
            with open(ROOT_PATH + "/configuration.yaml", "r") as config:
                return yaml.load(config)
        except FileNotFoundError as e:
            self.__create_default_yaml_file()

            raise TestContextException("Missing configuration .yaml file. System create .yaml template at {}".format(
                ROOT_PATH + "/sample_configuration.yaml"), e)

    def __create_default_yaml_file(self):
        with open(ROOT_PATH + "/sample_configuration.yaml", "w") as f:
            f.write("# Please change file to configuration.yaml"
                    "base_url: input_full_base_url \n "
                    "browser: input_browser_type \n"
                    "api_url: input_api_url \n"
                    "gui_url: input_gui_url")


ROOT_PATH = path.dirname(path.abspath(__file__))
YAML_CONFIG = _Configuration().yaml
BASE_URL = _Configuration().base_url
API_URL = _Configuration().api_url
GUI_URL = _Configuration.gui_url
BROWSER = _Configuration().browser
PROTOCOL = _Configuration().protocol
REQUEST_TIMEOUT = _Configuration().timeout
