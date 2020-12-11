from Core.DatabaseFactory.DatabaseType import DatabaseType
from Utils.DatabaseUtils import DatabaseHelper


class BaseDataModel(object):

    def __init__(self):
        self.__database = DatabaseHelper(DatabaseType.MONGO_DB).database_query

    @staticmethod
    def __create_list_model_object(model_class, result):
        all_object = []
        for r in result:
            all_object.append(model_class(r))
        return all_object

    def _get_all_item_in_collection(self, collection, model_class):
        result = self.__database.get_all_item_in_collection(collection)
        return self.__create_list_model_object(model_class, result)

    def _get_all_item_with_filter(self, collection, filter_query, model_class):
        result = self.__database.get_list_item_in_collection(collection, filter_query)
        return self.__create_list_model_object(model_class, result)
