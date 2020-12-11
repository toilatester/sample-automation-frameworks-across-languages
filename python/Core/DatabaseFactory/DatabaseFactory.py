from Core.Helper.Constant import Constant


class DatabaseFactory(object):
    @staticmethod
    def create_database_instance(clazz,
                                 db_name=None,
                                 host=None,
                                 username=None,
                                 password=None,
                                 client_host=None,
                                 client_port=None):
        for db_cls in Constant.DATABASE_CLASS:
            if clazz in db_cls.__module__:
                return db_cls(db_name, host, username, password, client_host, client_port)
