from abc import ABC
from abc import abstractmethod


class DatabaseQuery(ABC):
    @staticmethod
    def query_invoke(func):
        def wrapper_method(self_instance, *args, **kwargs):
            try:
                self_instance.create_connection()
                result = func(self_instance, *args, **kwargs)
                return result
            finally:
                self_instance.close_connection()

        return wrapper_method

    @abstractmethod
    def create_connection(self):
        pass

    @abstractmethod
    def close_connection(self):
        pass

    @abstractmethod
    def get_object_by_id(self, collection, object_id):
        pass

    @abstractmethod
    def get_object(self, collection, key, value):
        pass

    @abstractmethod
    def get_collection(self, collection):
        pass

    @abstractmethod
    def get_all_item_in_collection(self, collection):
        pass

    @abstractmethod
    def get_item_in_collection(self, collection, filter_query):
        pass

    @abstractmethod
    def get_list_item_in_collection(self, collection, filter_query):
        pass

    @abstractmethod
    def count_item_in_query(self, collection, filter_query):
        pass

    @abstractmethod
    def close_client_connection(self):
        pass

    @abstractmethod
    def close_server(self):
        pass
