import pyAesCrypt
import os

#  функция шифрование файла

def encrypt_file(file,password):

    #задаем размер буфера
    buffer_size = 512 * 1024

    #вызываем меторд шифрование
    pyAesCrypt.encryptFile(
        str(file),
        str(file) + ".crp",
        password,
        buffer_size
    )

    #ну кароче что бы видеть резултать выводиим на печать зашифрованный файл
    print("[Файл '" + str(os.path.splitext(file)[0]) + "зашифрован]")


    #Удаляем ну по типу исходный фАЙЛ
    os.remove(file)

def walking_by_dris(dir,password):

    for name in  os .listdir(dir):
        path = os.path.join(dir,name)

        if os.path.isfile(path):
            try:
                encrypt_file(path,password)
            except Exception as ex:
                      print(ex)
        else:
            walking_by_dris(dir,password)
            password = input("Введите пароль для шифрование:")
            walking_by_dris("",password)



