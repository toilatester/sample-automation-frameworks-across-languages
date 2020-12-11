from mongoengine import connect
from Config import YAML_CONFIG


class BaseModel(object):
    '''
    We don't need to close mongodb connection
    because it will auto close
    '''
    __mongodb_client_host = YAML_CONFIG.get('database_url')
    __mongodb_client_port = YAML_CONFIG.get('database_port')
    mongodb_connection = connect(db=YAML_CONFIG.get("mongodb_db_name"),
                                 host=f'mongodb://{__mongodb_client_host}:{__mongodb_client_port}')


class BaseModelMongoDB(BaseModel):
    pass
