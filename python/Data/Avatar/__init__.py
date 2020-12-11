from Config import ROOT_PATH
from os import path


def get_list_invalid_size_avatar():
    result = [
        "_1mb.jpeg",
        "_1mb.jpg",
        "_1mb.png",
    ]
    return list(map(lambda x: path.join(path.dirname(path.abspath(__file__)), x), result))


def get_list_invalid_type_avatar():
    result = [
        "_500kb.doc",
        "_500kb.exe",
        "_500kb.gif",
        "_500kb.pdf",
        "_500kb.xml",
    ]
    return list(map(lambda x: path.join(path.dirname(path.abspath(__file__)), x), result))


def get_list_invalid_format_avatar():
    result = [
        "_500kb.jpeg",
        "_500kb.jpg",
        "_500kb.png",
    ]
    return list(map(lambda x: path.join(path.dirname(path.abspath(__file__)), x), result))


def get_valid_avatar():
    return path.join(path.dirname(path.abspath(__file__)), "valid_avatar.png")
