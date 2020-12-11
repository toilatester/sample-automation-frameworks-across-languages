from pymongo import MongoClient

from Config import YAML_CONFIG
from Core.DatabaseFactory.DatabaseQuery.DatabaseQuery import DatabaseQuery


class MongoQuery(DatabaseQuery):
    mongodb_name = YAML_CONFIG.get("mongodb_db_name")
    mongodb_host = YAML_CONFIG.get("mongodb_host")
    mongodb_username = YAML_CONFIG.get("mongodb_user")
    mongodb_password = YAML_CONFIG.get("mongodb_pass")
    mongodb_client_host = YAML_CONFIG.get('database_url')
    mongodb_client_port = YAML_CONFIG.get('database_port')

    def __init__(self,
                 database_name,
                 host,
                 username,
                 password,
                 client_host,
                 client_port):
        self.__db_name = database_name or self.mongodb_name
        self.__mongo_host = host or self.mongodb_host
        self.__mongo_username = username or self.mongodb_username
        self.__mongo_password = password or self.mongodb_password
        self.__mongo_client_host = client_host or self.mongodb_client_host
        self.__mongo_client_port = client_port or self.mongodb_client_port
        self.__server = None
        self.__client = None
        self.__db = None

    @DatabaseQuery.query_invoke
    def get_object_by_id(self, collection, object_id):
        return self.__db[collection].find({"_id": object_id})

    @DatabaseQuery.query_invoke
    def get_object(self, collection, key, value):
        return self.__db[collection].find({key: value})

    def get_collection(self, collection):
        self.create_connection()
        return self.__db[collection]

    @DatabaseQuery.query_invoke
    def get_all_item_in_collection(self, collection):
        result = self.__db[collection].find()
        list_items = []
        for r in result:
            list_items.append(r)
        return list_items

    @DatabaseQuery.query_invoke
    def get_item_in_collection(self, collection, filter_query):
        return self.__db[collection].find_one(filter_query)

    @DatabaseQuery.query_invoke
    def get_list_item_in_collection(self, collection, filter_query):
        c = self.__db[collection]
        result = []
        for item in c.find(filter_query):
            result.append(item)
        return result

    @DatabaseQuery.query_invoke
    def count_item_in_query(self, collection, filter_query):
        return self.__db[collection].find(filter_query).count()

    def create_connection(self):
        """
                for connect via ssh tunnel
                self.__server = SSHTunnelForwarder(
                        self.__host,
                        ssh_username=self.__user,
                        ssh_password=self.__pass,
                        remote_bind_address=(YAML_CONFIG.get('database_url'), YAML_CONFIG.get('database_port'))
                    )
                    self.__server.start()
                :return:
        """
        if not self.__db:
            self.__client = MongoClient(self.__mongo_client_host, self.__mongo_client_port)
            self.__db = self.__client[self.__db_name]

    def close_connection(self):
        self.close_client_connection()
        self.close_server()
        self.__db = None

    def close_client_connection(self):
        if self.__client:
            self.__client.close()

    def close_server(self):
        if self.__server:
            self.__server.close()

    __module__ = "mongo"
