from faker import Faker
from faker.providers import internet, address, \
    automotive, barcode, color, company, credit_card, \
    currency, date_time, file, isbn, job, lorem, misc, \
    person, phone_number, profile, ssn, user_agent, python
from typing import Union
import random
import string
import uuid
from Core.Helper.Singleton import Singleton

TEST_PREFIX = "QATEST"


class DataGenerateUtils(metaclass=Singleton):
    PREFIX = "QATEST"

    def __init__(self):
        self.__faker: Union[
            internet.Provider, address.Provider, automotive.Provider, barcode.Provider, color.Provider,
            company.Provider, credit_card.Provider, currency.Provider, date_time.Provider, file.Provider,
            isbn.Provider, job.Provider, lorem.Provider, misc.Provider, person.Provider, phone_number.Provider,
            profile.Provider, ssn.Provider, user_agent.Provider, python.Provider] = Faker()

    def create_email(self):
        return self.PREFIX + self.__faker.email()

    def create_name(self):
        return self.PREFIX + self.__faker.name()

    def create_number(self):
        return self.__faker.building_number()

    def create_password(self, length=8, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(length))

    def create_text(self, chars_length=30, list_random_words=None):
        return self.__faker.text(chars_length, ext_word_list=list_random_words)

    def create_uuid_number(self):
        return self.PREFIX + uuid.uuid1().__str__()
