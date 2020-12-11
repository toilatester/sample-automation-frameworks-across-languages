import sys

__author__ = 'hnminh@outlook.com'

from Core.Config.SeleniumElement.TableElement import TableElement
from Core.Config.SeleniumElement.InputElement import InputElement
from Core.Config.SeleniumElement.DropdownElement import ComboBoxElement
from Core.Config.SeleniumElement.ButtonElement import ButtonElement
from Core.Config.SeleniumElement.Element import BaseElement


class SeleniumElement(TableElement, InputElement, ComboBoxElement, ButtonElement):
    pass
