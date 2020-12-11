from Core.Base import BaseTest
from Core.Base import RepeatedTest
import time


class RepeatedTest(BaseTest):
    def __init__(self, *args, **kwargs):
        BaseTest.__init__(self, *args, **kwargs)
        self.is_api_test = True
        self.count = 0

    def repeated_setup(self):
        print("========== Repeated Test Set Up=============")
        print("Cycle run {}".format(self.count + 1))

    @RepeatedTest(repeated_number=6, parallel=True, thread_count=6)
    def test_repeated(self):
        if self.count == 0:
            time.sleep(10)
        else:
            time.sleep(1)
        self.count += 1
        print("========== Invoke Method ===================")

    def repeated_teardown(self):
        print("========== Repeated Test Tear Down=============")
        print("Cycle run {}".format(self.count + 1))
