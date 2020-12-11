from robot.libraries.BuiltIn import _Verify


class Assert(_Verify):
    def should_contain_in_list(self, list_item, expected_item, msg=None, values=True):
        asseert_boolean = True
        for item in list_item:
            if expected_item in item:
                break
        else:
            raise AssertionError(self._get_string_msg(list_item, expected_item, msg,
                                                      values, 'does not contain'))
        return asseert_boolean


class APIAssert(Assert):

    @staticmethod
    def should_return_successfully_response(expected_data, actual_data):
        pass

    @staticmethod
    def should_run_api_successfully(*args):
        failed_assert = []
        for assertion in args:
            try:
                assertion()
            except AssertionError as e:
                failed_assert.append(str(e))
        print(",".join(failed_assert))
        assert len(failed_assert) == 0, ",".join(failed_assert)
