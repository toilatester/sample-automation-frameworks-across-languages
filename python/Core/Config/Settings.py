import threading
import os
from Core.Helper.Constant import ConstantMeta
from Config import BASE_URL

__author__ = 'hnminh@outlook.com'


class Settings(metaclass=ConstantMeta):
    THREAD_LOCAL = threading.local()
    THREAD_LOCK = threading.Lock()
    BASE_URL = os.environ.get("LAURA_BASE_URL", BASE_URL)
