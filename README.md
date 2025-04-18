# Сервис "Электронное голосование" для акционеров

## Содержание
- [О проекте](#о-проекте)
- [Стек приложения](#стек-приложения)
- [Архитектура сервиса](#архитектура-сервиса)
- [Установка проекта](#установка-проекта)

## О проекте
 
**Веб-сервис, который позволит акционерам голосовать удаленно** (клиентская часть сервиса)

## Стек приложения

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=for-the-badge&logo=Axios&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Архитектура сервиса

Классическая архитектура

```
ELECTRONIC_VOTING (React + TypeScript, Vite)
│
├── public/                # Статические ресурсы
│
├── src/                   # Корневая папка с кодом             
│   ├── assets/            # Графика
│   ├── auth/              # Модуль аутентификации
│   ├── components/        # UI-компоненты
│   ├── pages/             # Страницы приложения
│   ├── requests/          # API-интеграция
│   ├── utils/             # Вспомогательные функции
│   ├── App.tsx            # Корневой компонент
│   ├── main.tsx           # Точка входа
│   └── layout.tsx         # Общий макет
├── .gitignore             # Игнорируемые файлы
├── package.json           # Зависимости и скрипты
├── tsconfig.json          # Настройки TypeScript
└── vite.config.ts         # Конфигурация Vite
```

## Установка проекта

1. Клонирование репозитория

```
git clone https://github.com/Irina946/ElectronicVoting.git
```

2. Установка зависимостей

```
cd /ElectronicVoting

npm install
```

3. Запуск dev сервера

```
npm run dev
```
