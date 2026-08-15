# Інструкція з розгортання та запуску проєкту «Нова Пошта — Пошук відділень»

Даний проект є веб-застосунком для отримання інформації про відділення та поштомати «Нової Пошти» у вказаному населеному пункті України з використанням офіційного **API v2.0**.

---

## 📋 Крок 1. Розміщення файлів та налаштування OpenServer

1. Завантаж архів із репозиторію (натисни кнопку **Code** $\rightarrow$ **Download ZIP**) та розпакуй його.
2. Перейди до папки з проектами вашого локального веб-сервера **OpenServer** за шляхом OSPanel/home/.

<img width="579" height="35" alt="image" src="https://github.com/user-attachments/assets/2f6d2cea-305c-4283-9cb3-8a403153f162" />

<img width="837" height="554" alt="image" src="https://github.com/user-attachments/assets/3913e589-2967-4e2b-8bfd-e4c16518f6a3" />

<img width="1083" height="680" alt="image" src="https://github.com/user-attachments/assets/e63691d9-0e95-4d10-80e5-7ccdb787663d" />

<img width="886" height="637" alt="image" src="https://github.com/user-attachments/assets/f9648432-dddd-4664-a314-0feedca3d328" />

Також прохання перевірити папку .osp, в ній міститься файл project.ini:

<img width="503" height="329" alt="image" src="https://github.com/user-attachments/assets/c4daabc3-f287-47d3-80e7-38db5468922c" />

3. Створи папку з чіткою назвою:
```text
gitdubvladidz3novapost.local

```

4. Перемісти вміст розпакованого архіву в створену папку.

Переконайся, що структура проекту має наступний вигляд:

```text
gitdubvladidz3novapost.local/
├── .osp/
│   └── project.ini
├── index.html
└── script.js

<img width="331" height="143" alt="image" src="https://github.com/user-attachments/assets/48b23dd9-0162-4ce8-bfdf-9b5eb185ccb0" />

```

### Налаштування віртуального хоста (`project.ini`)

У папочці `.osp` обов'язково має знаходитися конфігураційний файл `project.ini` із наступним вмістом:

```ini
[gitdubvladidz3novapost.local]

http_engine     = Nginx
php_engine      = PHP-8.3
project_enabled = on
web_root        = {base_dir}

```

---

## Крок 2. Отримання та налаштування API Ключа

Щоб додаток міг надсилати запити до реєстрів «Нової Пошти», необхідно отримати персональний API-ключ:

1. Перейди на офіційний портал розробників за посиланням:
👉 **https://developers.novaposhta.ua/**
2. На головній сторінці знайди розділ **Документація АПІ** та натисни на посилання **«Отримати API Key»** (або увійди в особистий кабінет).

<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/3625b3e7-60bd-4cc8-b81d-5dfefa6f60cc" />


3. Авторизуйся або зареєструйся у бізнес-кабінеті «Нової Пошти».
4. У лівому бічному меню перейди в розділ **Налаштування** $\rightarrow$ пункт **Безпека**.

<img width="248" height="816" alt="image" src="https://github.com/user-attachments/assets/8177a158-bf67-45eb-91d1-d47b5c6a5684" />

<img width="1592" height="468" alt="image" src="https://github.com/user-attachments/assets/2086ac81-fd51-47a6-b698-483fc134fa86" />


5. Натисни кнопку **«Створити ключ»** та скопіюй згенерований рядок API-ключа.

<img width="1694" height="497" alt="image" src="https://github.com/user-attachments/assets/e14aec61-1c0b-4269-b11f-be2b1c457e28" />

---

##  Крок 3. Запуск веб-застосунка

1. Перезапусти **OpenServer (OSPanel)**, щоб сервер застосував конфігурацію віртуального хоста.
2. Відкрий OpenServer файли, та запусти проєкт:

<img width="469" height="405" alt="image" src="https://github.com/user-attachments/assets/7285e4ea-9683-452b-ac56-c22bf6f7c815" />


> *[Скріншот 4: Відкритий проект у браузері]*

3. Встав отриманий API-ключ у верхнє поле на сторінці (він автоматично збережеться у `localStorage` вашого браузера, що дозволяє не світити ключ у публічному репозиторії GitHub).

---

## 🧪 Крок 4. Перевірка роботи та результати запитів

Для демонстрації викладачу або під час захисту лаби виконай такі тестування:

### 1. Пошук відділень у великих містах (наприклад, Харків)

* **Дія:** Введи `Харків` у поле пошуку та натисни **«Знайти»** (або клавішу `Enter`).
* **Результат:** Система сформує списки всіх працюючих відділень та поштоматів міста із вказівкою номера, адреси та вагових обмежень.

* <img width="1027" height="853" alt="image" src="https://github.com/user-attachments/assets/2a587125-2428-4f67-8f21-564c1abd2465" />

### 2. Пошук у регіональних населених пунктах

* **Дія:** Введи назву невеликого містечка чи села (наприклад, `Чугуїв` або `Мерефа`).
* **Результат:** Застосунок спочатку визначить унікальний `CityRef`, після чого виведе відповідні відділення.

<img width="978" height="856" alt="image" src="https://github.com/user-attachments/assets/6f238208-254f-471f-87e6-71b503aa0663" />

### 3. Перевірка захисту від некоректного введення

* **Порожнє поле:** Натискання кнопки пошуку без вказання міста викликає червоне сповіщення: *"Будь ласка, введіть назву міста чи села."*.

<img width="1035" height="438" alt="image" src="https://github.com/user-attachments/assets/5c64bcb4-7caa-4ebe-a56a-3945656a152c" />

* **Неіснуюче місто:** Введення випадкового набору букв (наприклад, `qwerty12345`) покаже відповідну помилку валідації від API.

* <img width="1003" height="456" alt="image" src="https://github.com/user-attachments/assets/95fd55ea-abc5-4364-95bd-1aa1e0f48b4c" />

---

## 🛠 Часті помилки та їх вирішення

* ❌ **Помилка «API Ключ відсутній»:**
Переконайся, що ти вставив свій API-ключ у верхній інпут перед виконанням пошуку.
* ❌ **Сайт не відкривається в браузері:**
Перевір, чи збігається назва папки (`gitdubvladidz3novapost.local`) із доміном у `[.osp/project.ini]`, та чи перезапустив ти OpenServer після створення папки.
