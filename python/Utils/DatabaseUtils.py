from Core.DatabaseFactory.DatabaseFactory import DatabaseFactory
from Core.DatabaseFactory.DatabaseQuery import DatabaseQuery


class DatabaseOptions(object):
    def __init__(self, db_name=None,
                 host=None,
                 username=None,
                 password=None,
                 client_host=None,
                 client_port=None):
        self.__db_name = db_name
        self.__host = host
        self.__username = username
        self.__password = password
        self.__client_host = client_host
        self.__client_port = client_port

    @property
    def db_name(self):
        return self.__db_name

    @property
    def host(self):
        return self.__client_host

    @property
    def username(self):
        return self.__username

    @property
    def password(self):
        return self.__password

    @property
    def client_host(self):
        return self.__client_host

    @property
    def client_port(self):
        return self.__client_port


class DatabaseHelper(object):
    def __init__(self, database_type,
                 db_options: DatabaseOptions = None):
        db_options = db_options if db_options is not None else DatabaseOptions()
        self.db_query = DatabaseFactory.create_database_instance(database_type,
                                                                 db_options.db_name,
                                                                 db_options.host,
                                                                 db_options.username,
                                                                 db_options.password,
                                                                 db_options.client_host,
                                                                 db_options.client_port)

    @property
    def database_query(self) -> DatabaseQuery:
        return self.db_query
