import json


class LocalStorage(object):

    def __init__(self, driver):
        self.driver = driver

    def set(self, key, value):
        self.driver.execute_script( \
            "window.localStorage.setItem('{}',{})".format(key, json.dumps(value)))

    def get(self, key=None):
        if key:
            return self.driver.execute_script( \
                "return window.localStorage.getItem('{}')".format(key))
        else:
            return self.driver.execute_script("""
        var items = {}, ls = window.localStorage;
        for (var i = 0, k; i < ls.length; i++)
          items[k = ls.key(i)] = ls.getItem(k);
        return items;
        """)

    def remove(self, key):
        self.driver.execute_script("window.localStorage.removeItem('{}');".format(key))

    def clear(self):
        self.driver.execute_script("window.localStorage.clear();")
