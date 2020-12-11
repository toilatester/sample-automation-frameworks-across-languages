from Core.Config.SeleniumElement.Element import BaseElement


class InputElement(BaseElement):

    def clear_and_send_keys(self, text_input):
        self._wrapper_element.clear()
        self._wrapper_element.send_keys(text_input)

    def get_element_text_value(self):
        text_value = self._wrapper_element.get_attribute("value")
        if len(text_value) > 0:
            return text_value
        else:
            return self._wrapper_element.get_attribute("innerHTML")
