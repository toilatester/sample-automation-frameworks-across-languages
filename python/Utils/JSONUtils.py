import json


class JSONUtils(object):
    @staticmethod
    def get_value_json_string(json_source_string, key):
        return json.loads(json_source_string)[key]
