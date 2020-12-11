from mongoengine import Document, EmbeddedDocumentField, StringField, \
    ListField, BooleanField, EmailField, DateTimeField, EmbeddedDocument
from typing import List
from Model.BaseModel import BaseModelMongoDB
from Model.Bot import Bot


class _EmbeddedDocumentBots(EmbeddedDocument):
    botId = StringField()
    botName = StringField()
    role = StringField()


class Customer(BaseModelMongoDB):
    class _CustomerORM(Document):
        meta = {'collection': 'Customer',
                'strict': False,
                'indexes': [
                    'email'
                ]
                }

        previousHashedPassword = StringField()
        bots = ListField(EmbeddedDocumentField(_EmbeddedDocumentBots))
        zoneName = StringField()
        isValidated = BooleanField()
        isDeactivated = BooleanField()
        isOnline = BooleanField()
        isSuperAdmin = BooleanField()
        email = EmailField()
        username = StringField()
        hashedPassword = StringField()
        lastOnlineAt = DateTimeField()
        createdAt = DateTimeField()
        updatedAt = DateTimeField()

    def get_customer_by_email(self, email) -> List['Customer._CustomerORM']:
        result = self._CustomerORM.objects(email=email)
        return result

    def delete_customer_by_email(self, email):
        result = self.get_customer_by_email(email)
        for item in result:
            self.__clean_bot_associate_with_email(item.email)
            item.delete()

    def get_list_bot_by_email(self, email):
        result = self.get_customer_by_email(email)
        list_bot_id = []
        for item in result:
            bots: List[_EmbeddedDocumentBots] = item.bots
            for bot in bots:
                list_bot_id.append(bot.botId)
        return list_bot_id

    def __clean_bot_associate_with_email(self, email):
        bot_model = Bot()
        list_bots = self.get_list_bot_by_email(email)
        for bot in list_bots:
            bot_model.delete_bot_by_id(bot)
