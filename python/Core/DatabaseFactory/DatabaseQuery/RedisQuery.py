import ast

import redis
from sshtunnel import SSHTunnelForwarder

from Config import YAML_CONFIG
from Core.DatabaseFactory.DatabaseQuery.DatabaseQuery import DatabaseQuery


class RedisQuery(DatabaseQuery):
    redisdb_name = 0
    redisdb_ssh_host = YAML_CONFIG.get("database_url")
    redisdb_ssh_username = YAML_CONFIG.get("mongodb_user")
    redisdb_ssh_password = YAML_CONFIG.get("mongodb_pass")
    redisdb_client_host = YAML_CONFIG.get("redis_host")
    redisdb_client_port = YAML_CONFIG.get("redis_port")

    def __init__(self,
                 database_name,
                 host,
                 username,
                 password,
                 client_host,
                 client_port):
        self.__db_name = database_name or self.redisdb_name
        self.__redis_host = host or self.redisdb_ssh_host
        self.__redis_username = username or self.redisdb_ssh_username
        self.__redis_password = password or self.redisdb_ssh_password
        self.__redis_client_host = client_host or self.redisdb_client_host
        self.__redis_client_port = client_port or self.redisdb_client_port
        self.__server = None
        self.__client = None
        self.__db = None

    @DatabaseQuery.query_invoke
    def get_object_by_id(self, collection, object_id):
        return self.get_object(collection, "id", object_id)

    @DatabaseQuery.query_invoke
    def get_object(self, collection, key, value):
        keys = self.__db.keys("*{}*".format(collection))
        for item in keys:
            # convert to dict
            obj = ast.literal_eval(self.__db.get(item))
            try:
                if obj[key] == value:
                    break
            except KeyError:
                # continue loop when encountering object where "key" does not exist
                continue
        else:
            raise Exception("No object matches provided key and value.")
        return obj

    def get_collection(self, collection):
        self.create_connection()
        return self.__db.keys("*{}*".format(collection))

    @DatabaseQuery.query_invoke
    def get_all_item_in_collection(self, collection):
        return [ast.literal_eval(self.__db.get(key)) for key in self.__db.keys("*{}*".format(collection))]

    @DatabaseQuery.query_invoke
    def get_item_in_collection(self, collection, filter_query):
        return ast.literal_eval(self.__db.get(
            self.__db.keys("*{0}*{1}*".format(collection, filter_query))[0]))

    @DatabaseQuery.query_invoke
    def get_list_item_in_collection(self, collection, filter_query):
        return [ast.literal_eval(self.__db.get(key)) for key in
                self.__db.keys("*{0}*{1}*".format(collection, filter_query))]

    @DatabaseQuery.query_invoke
    def count_item_in_query(self, collection, filter_query):
        return len(self.__db.keys(filter_query))

    def create_connection(self):
        if not self.__db:
            self.__server = SSHTunnelForwarder(self.__redis_host,
                                               ssh_username=self.__redis_username,
                                               ssh_password=self.__redis_password,
                                               remote_bind_address=(self.__redis_client_host, self.__redis_client_port),
                                               local_bind_address=('localhost', 8080))
            self.__server.start()
            self.__db = redis.StrictRedis(host=self.__server.local_bind_address[0],
                                          port=self.__server.local_bind_address[1],
                                          db=self.__db_name,
                                          charset="utf-8",
                                          decode_responses=True)

    def close_connection(self):
        self.close_server()
        self.close_client_connection()
        self.__db = None

    def close_client_connection(self):
        if self.__client:
            self.__client.close()

    def close_server(self):
        if self.__server:
            self.__server.stop()

    __module__ = "redis"
