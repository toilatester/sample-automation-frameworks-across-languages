from Core.Assertions.Assertion import Assert, APIAssert


class BaseValidation(object):
    def __init__(self):
        self.assertion = Assert()
        self.api_assertion = APIAssert()
        self.assertion.log = self.__log

    def __log(self, msg, level):
        pass
