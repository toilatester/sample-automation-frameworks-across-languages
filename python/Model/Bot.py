from Core.Base.BaseModel import BaseDataModel
from mongoengine import Document, EmbeddedDocumentField, StringField, \
    EmbeddedDocument, ListField, BooleanField, DateTimeField
from typing import List
from Model.BaseModel import BaseModelMongoDB


class _BotOwner(EmbeddedDocument):
    username = StringField()
    email = StringField()
    role = StringField()
    id = StringField()


class Bot(BaseModelMongoDB):
    class _BotORM(Document):
        meta = {'collection': 'Bot',
                'strict': False,
                'indexes': [
                    'botId'
                ]
                }

        botId = StringField()
        token = StringField()
        channelIds = ListField(StringField())
        creators = ListField(EmbeddedDocumentField(_BotOwner))
        avatarUrl = StringField()
        chatboxTitle = StringField()
        botTextColor = StringField()
        botBackgroundColor = StringField()
        userTextColor = StringField()
        userBackgroundColor = StringField()
        isDeactivated = BooleanField()
        isEnableAutomation = BooleanField()
        zoneName = StringField()
        isCompleted = BooleanField()
        name = StringField()
        website = StringField()
        createdAt = DateTimeField()
        updatedAt = DateTimeField()
        connectorId = StringField()

    def get_bot_by_id(self, bot_id) -> List['Bot._BotORM']:
        result = self._BotORM.objects(botId=bot_id)
        return result

    def delete_bot_by_id(self, bot_id):
        result = self.get_bot_by_id(bot_id)
        for item in result:
            item.delete()


class BotDataModel(BaseDataModel):
    class BotInformation(object):
        def __init__(self, json_data):
            self.__bot = json_data

        @property
        def bot_information(self):
            return self.__bot

        @property
        def bot_id(self):
            return self.__bot['botId']

        @property
        def bot_name(self):
            return self.__bot['name']

        @property
        def creators(self):
            return self.__bot['creators']

        @property
        def token(self):
            return self.__bot['token']

        @property
        def website(self):
            return self.__bot['website']

        @property
        def knowledge_base_id(self):
            return self.__bot['microsoftKnowledgeBaseId']

    @property
    def get_all_bots_data(self) -> List['BotInformation']:
        return self._get_all_item_in_collection('Bot', BotDataModel.BotInformation)

    def get_bot_via_bot_id(self, bot_id) -> List['BotInformation']:
        return self._get_all_item_with_filter('Bot', {"botId": bot_id}, BotDataModel.BotInformation)

    def get_bots_via_bot_name(self, bot_name) -> List['BotInformation']:
        return self._get_all_item_with_filter('Bot', {"name": bot_name}, BotDataModel.BotInformation)

    def get_bots_via_creators_email(self, email) -> List['BotInformation']:
        return self._get_all_item_with_filter('Bot', {"creators.email": email}, BotDataModel.BotInformation)

    def get_bots_via_kb_id(self, kb_id) -> List['BotInformation']:
        return self._get_all_item_with_filter('Bot', {"microsoftKnowledgeBaseId": kb_id}, BotDataModel.BotInformation)
