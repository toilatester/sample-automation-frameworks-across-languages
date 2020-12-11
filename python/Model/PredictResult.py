from typing import List


class _Entities(object):
    pass


class _Intent(object):
    def __init__(self, question: str, confidence: float):
        self.__question = question if question is not None else "__NULL_PREDICT__"
        self.__confidence = confidence

    @property
    def question(self):
        return self.__question

    @property
    def confidence(self):
        return self.__confidence


class PredictResult(object):
    def __init__(self, question: str, intent: dict, entities: List['dict'], intent_ranking: List['dict']):
        self.__question = question
        self.__predict = _Intent(intent['name'], intent['confidence'])
        self.__intent_ranking = [_Intent(item['name'], item['confidence']) for item in intent_ranking]
        self.__entities = entities

    @property
    def question(self) -> str:
        return self.__question

    @property
    def predict(self) -> _Intent:
        return self.__predict

    @property
    def intent_ranking(self) -> List['_Intent']:
        return self.__intent_ranking

    @property
    def entities(self) -> List['_Entities']:
        return self.__entities
