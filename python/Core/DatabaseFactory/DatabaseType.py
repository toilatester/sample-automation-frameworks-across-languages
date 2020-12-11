from Core.Helper.Constant import ConstantMeta


class DatabaseType(metaclass=ConstantMeta):
    MONGO_DB = "mongo"
    REDIS_DB = "redis"