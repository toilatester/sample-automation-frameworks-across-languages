from mongoengine import Document, IntField, ListField, BooleanField, StringField, DateTimeField
from mongoengine.queryset.queryset import QuerySet
from Model.BaseModel import BaseModelMongoDB


class History(BaseModelMongoDB):
    class _HistoryORM(Document):
        meta = {
            "collection": "History",
            'strict': False,
        }
        score = IntField()
        entities = ListField()
        suggestions = ListField()
        knowledgeReferences = ListField()
        isFromAdmin = BooleanField()
        fromAdminId = StringField()
        fromAdminAvatar = StringField()
        fromAdminEmail = StringField()
        fromAdminUsername = StringField()
        isFromSimulator = BooleanField()
        botId = StringField()
        connectorId = StringField()
        channelId = StringField()
        conversationId = StringField()
        intent = StringField()
        question = StringField()
        response = StringField()
        insertedAt = DateTimeField()
        createdAt = DateTimeField()
        updatedAt = DateTimeField()
        # __v = IntField()  # Cannot recognized by mongoengine

    def get_all_history_of_bot(self, bot_id) -> QuerySet:
        result = self._HistoryORM.objects(botId=bot_id)
        return result

    def get_history_of_conversation(self, conversation_id) -> QuerySet:
        result = self._HistoryORM.objects(conversationId=conversation_id)
        return result

    def remove_history_of_bot(self, bot_id):
        result = self.get_all_history_of_bot(bot_id)
        result.delete()
