import zipfile
import os


def un_zip(file_name, password=""):
    zip_file = zipfile.ZipFile(file_name)

    try:
        for names in zip_file.namelist():
            zip_file.extract(names, "d:/zhangdan/email/", password.encode())
    except Exception as result:
        print("文件名重复，报错:\n%s\n请查看文件是否已解压" % result)
        return False
    return True
