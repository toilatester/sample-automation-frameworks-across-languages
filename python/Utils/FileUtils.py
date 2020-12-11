from os import path


class FileUtils(object):
    def __init__(self):
        pass

    def create_file(self, name: str, ext: str, content):
        filename = "{}.{}".format(name, ext)
        file = open(filename, "w+")
        file.write(content)
        file.close()

    @staticmethod
    def get_root_directory():
        current_dir = path.dirname(path.realpath(__file__))
        return path.dirname(current_dir)

    @staticmethod
    def is_file(file_path):
        return path.isabs(file_path) or path.isabs(path.join(FileUtils.get_root_directory(), file_path))


class HTMLFileUtils(object):
    def __init__(self):
        pass

    def create_html_file_with_injected_script(self, filename, injected_script):
        if path.splitext(filename)[1][1:] != 'html':
            raise Exception("InvalidParameter: Not HTML Filename")
        try:
            file = open(filename, "w+")
            file.write(self.__generate_file_content(injected_script))
        except IOError:
            pass
        finally:
            real_path = path.realpath(file.name)
            file.close()
        return real_path

    def __generate_file_content(self, injected_script):
        template = "<body>\r\n" \
                   "{}\r\n" \
                   "</body>\r\n"
        return template.format(injected_script)
