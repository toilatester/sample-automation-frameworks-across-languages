from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webdriver import WebElement
from selenium.webdriver.support import expected_conditions as wait_condition
from selenium.webdriver.common.by import By
from Core.Config.DriverFactory import DriverFactory
from Core.Exceptions.TestContextException import TestContextException
from Core.Helper.Constant import Constant
from typing import TypeVar, Generic, List

T = TypeVar('T')


class ElementFactory(object):

    @staticmethod
    def get_element(element_cls: T, by, locator, base_element=None) -> T:
        """
        Find WebElement and init with cls_element type
        Returns:
            Element Class Input:
        """
        return ElementFactory.__find_element(by=by, locator=locator,
                                             cls_element=element_cls,
                                             base_element=base_element)

    @staticmethod
    def get_list_element(element_cls: T, by, locator, base_element=None) -> List['T']:
        """
        Find List WebElement and init with cls_element type
        Returns:
            List Element Class Input:
        """
        return ElementFactory.__find_list_element(by=by, locator=locator,
                                                  cls_element=element_cls,
                                                  base_element=base_element)

    @staticmethod
    def get_element_until(element_cls: T, by, locator, wait_type, time_out=30, base_element=None) -> T:
        """
        Find WebElement with wait condition and init with cls_element type

        Returns:
            Element Class Input:
        """
        return ElementFactory.__find_with_condition(by=by, locator=locator,
                                                    wait_type=wait_type,
                                                    cls_element=element_cls,
                                                    time_out=time_out,
                                                    base_element=base_element)

    @staticmethod
    def __find_element(cls_element: T, by: By, locator: str, base_element=None) -> T:
        validate_param = ElementFactory.__validate_find_element_param

        class Find(Generic[T], object):
            _parent_element: WebElement = None
            _target_element: T = None
            _by = None
            _locator = None
            _element_cls = None

            def __init__(self, _by: By, _locator: str, element_cls: T, parent_element=None) -> None:
                super(Find, self).__init__()
                self._by = _by
                self._locator = _locator
                self._element_cls = element_cls
                self._parent_element = parent_element
                validate_param(by=_by, locator=_locator, element_cls=element_cls)

            def __get__(self, obj, *args) -> T:
                self._wrapped_element()
                return self._target_element

            def __getattribute__(self, item):
                if hasattr(Find, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getattr__(self, item):
                if hasattr(Find, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getitem__(self, key):
                self._wrapped_element()
                return self._target_element.__getitem__(key)

            def __call__(self, *args, **kwargs):
                if self._target_element is None:
                    self._wrapped_element()
                return self

            @property
            def element(self: T) -> T:
                return self

            def _wrapped_element(self):
                element = self._search_element()
                self._target_element = self._element_cls.__call__(element)

            def _search_element(self):
                if self._parent_element is not None:
                    return self._parent_element.find_element(by=self._by, value=self._locator)
                else:
                    selenium_driver = DriverFactory.get_driver()
                    return selenium_driver.core_driver.find_element(by=self._by, value=self._locator)

        return Find(_by=by, _locator=locator, element_cls=cls_element, parent_element=base_element)

    @staticmethod
    def __find_list_element(cls_element: T, by: By, locator: str, base_element=None) -> List['T']:
        validate_param = ElementFactory.__validate_find_element_param

        class Finds(Generic[T], object):
            _parent_element: WebElement = None
            _target_element: List['T'] = None
            _by = None
            _locator = None
            _element_cls = None

            def __init__(self, _by: By, _locator: str, element_cls: T, parent_element=None) -> None:
                super(Finds, self).__init__()
                self._by = _by
                self._locator = _locator
                self._element_cls = element_cls
                self._parent_element = parent_element
                validate_param(by=_by, locator=_locator, element_cls=element_cls)

            def __get__(self, obj, *args) -> List['T']:
                self._wrapped_element()
                return self._target_element

            def __getattribute__(self, item):
                if hasattr(Finds, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getattr__(self, item):
                if hasattr(Finds, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getitem__(self, key):
                self._wrapped_element()
                return self._target_element.__getitem__(key)

            def __call__(self, *args, **kwargs):
                if self._target_element is None:
                    self._wrapped_element()
                return self

            @property
            def elements(self) -> List['T']:
                return self

            def _search_element(self):
                if self._parent_element is not None:
                    return self._parent_element.find_elements(by=self._by, value=self._locator)
                else:
                    selenium_driver = DriverFactory.get_driver()
                    return selenium_driver.core_driver.find_elements(by=self._by, value=self._locator)

            def _wrapped_element(self):
                elements = self._search_element()
                wrapped_elements = []
                for element in elements:
                    wrapped_elements.append(self._element_cls.__call__(element))
                self._target_element = wrapped_elements

        return Finds(_by=by, _locator=locator, element_cls=cls_element, parent_element=base_element)

    @staticmethod
    def __find_with_condition(cls_element: T, by: By, locator: str,
                              wait_type: wait_condition = None, time_out=30, base_element=None) -> T:
        validate_param = ElementFactory.__validate_find_element_param

        class FindUntil(Generic[T], object):
            _parent_element: WebElement = None
            _target_element: T = None
            _wait_type: wait_condition = None
            _time: int = 30
            _by = None
            _locator = None
            _element_cls = None

            def __init__(self, _by: By, _locator: str, element_cls: T, _wait_type: wait_condition, time: int = 30,
                         parent_element=None) -> None:
                super(FindUntil, self).__init__()
                self._wait_type = _wait_type
                self._time = time
                self._by = _by
                self._locator = _locator
                self._element_cls = element_cls
                self._parent_element = parent_element
                validate_param(by=_by, locator=_locator, element_cls=element_cls)

            def __get__(self, obj, *args) -> T:
                self._wrapped_element()
                return self._target_element

            def __getattribute__(self, item):
                if hasattr(FindUntil, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getattr__(self, item):
                if hasattr(FindUntil, item):
                    return object.__getattribute__(self, item)
                return self._target_element.__getattribute__(item)

            def __getitem__(self, key):
                self._wrapped_element()
                return self._target_element.__getitem__(key)

            def __call__(self, *args, **kwargs):
                if self._target_element is None:
                    self._wrapped_element()
                return self

            @property
            def element(self) -> T:
                return self

            def _search_element(self):
                selenium_driver = DriverFactory.get_driver()
                if self._parent_element is not None:
                    self._wait_until(selenium_driver.core_driver)
                    return self._parent_element.find_elements(by=self._by, value=self._locator)
                else:
                    self._wait_until(selenium_driver.core_driver)
                    return selenium_driver.core_driver.find_elements(by=self._by, value=self._locator)

            def _wrapped_element(self):
                elements = self._search_element()
                wrapped_elements = []
                for element in elements:
                    wrapped_elements.append(self._element_cls.__call__(element))
                if len(wrapped_elements) == 1:
                    self._target_element = wrapped_elements[0]
                else:
                    self._target_element = wrapped_elements

            def _wait_until(self, driver: WebDriver):
                wait = WebDriverWait(driver, self._time)
                wait.until(self._wait_type((self._by, self._locator)))

        return FindUntil(_by=by, _locator=locator, _wait_type=wait_type, element_cls=cls_element, time=time_out,
                         parent_element=base_element)

    @staticmethod
    def __validate_find_element_param(by: By, locator: str, element_cls: T):
        if by is None:
            raise TestContextException("By value cannot be None type")
        if locator is None:
            raise TestContextException("locator value cannot be None type")
        if element_cls not in Constant.WEB_ELEMENT_CLASS:
            raise TestContextException(
                "Element Class is invalid, please using list classes below " + str(Constant.WEB_ELEMENT_CLASS))
