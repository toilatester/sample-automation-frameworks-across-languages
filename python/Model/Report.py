from mongoengine import Document, IntField, StringField, DateTimeField
from mongoengine.queryset.queryset import QuerySet
from Model.BaseModel import BaseModelMongoDB

TYPE = ("TOTAL_CONVERSATION_DURATION", "TOTAL_UNANSWERED_MESSAGE", "TOTAL_CONVERSATION", "TOTAL_MESSAGE_TO_BOT")


class Report(BaseModelMongoDB):
    class _ReportORM(Document):
        meta = {
            "collection": "Report",
            'strict': False,
        }
        botId = StringField()
        date = StringField()
        type = StringField(choices=TYPE)
        zoneName = StringField()
        createdAt = DateTimeField()
        month = IntField()
        updatedAt = DateTimeField()
        value = IntField()
        week = IntField()
        year = IntField()

    def get_report_of_bot(self, bot_id) -> QuerySet:
        result = self._ReportORM.objects(botId=bot_id)
        return result

    def get_report_of_bot_on_date(self, bot_id, date):
        result = self._ReportORM.objects(botId=bot_id, date=date)
        return result
