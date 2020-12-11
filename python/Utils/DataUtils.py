import csv
from Core.Helper.Singleton import Singleton


class DataUtils(metaclass=Singleton):
    def __init__(self):
        pass

    def get_data(self, file_name):
        try:
            with open(file_name, 'r') as csv_file:
                reader = csv.reader(csv_file)
                return list(reader)
        except IOError:
            print("Error file input")
            return []

    def write_data(self, output_file_name, output_data):
        try:
            with open(output_file_name, 'w', newline='') as csv_file:
                fieldnames = output_data[0]
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(output_data)
        except IOError:
            print("Error: File does not appear to exist.")
            return 0

    def write_data_from_list(self, output_file_name, output_data):
        try:
            with open(output_file_name, 'w', newline='', encoding="utf-8") as csv_file:
                writer = csv.writer(csv_file)
                for res in output_data[0:]:
                    writer.writerow(res)
        except IOError:
            print("Error: File does not appear to exist.")
            return 0

    def get_number_of_row_data(self, file_name):
        try:
            with open(file_name, 'r') as csv_file:
                reader = csv.reader(csv_file)
                # fileObject is your csv.reader
                row_count = sum(1 for row in reader)
                return row_count
        except IOError:
            print("Error file input")
            return []
