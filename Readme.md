# :floppy_disk: Что посмотреть

---

## Памятка

### Для запуска проекта используются следующие переменные окружения:

`PORT=3000 - Порт для входящих соединений`
`SALT=salt - Соль для хэша пароля`
`DB_HOST=127.0.0.1 - IP-адрес сервера базы данных (MongoDB)`
`DB_USER=admin - Имя пользователя для подключения к базе данных (MongoDB)`
`DB_PASSWORD=test - Пароль для подключения к базе данных (MongoDB`
`DB_PORT=27017 - Порт для подключения к базе данных (MongoDB)`
`DB_NAME=what-to-watch - Имя базы данных (MongoDB)`
`UPLOAD_DIRECTORY=upload - Каталог для загрузки файлов`
`JWT_SECRET=secret - Секрет для JWT`
`STATIC_DIRECTORY_PATH=static - Путь к каталогу со статическими ресурсами`
`HOST=localhost - Хост на котором запускается сервис`

### Сценарии запуска и работы с проектом описаны в [Workflow.md](/Workflow.md)

В репозитории имеется фронтенд связанный с данным REST API, находящийся в директории [frontend](/frontend), все для работы указано в [Readme.md](/frontend/Readme.md)
