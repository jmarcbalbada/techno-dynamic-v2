# Techno-Dynamic-Learning V2 (TechnoDynamic V2)

Techno-Dynamic-Learning V2 is an advanced learning management system designed specifically for technopreneurship courses. Building upon the foundation of [Techno-Dynamic-Learning V1](https://github.com/sebastianyebes/Techno-Dynamic-Learning), this extended version incorporates dynamic content generation and insightful suggestions based on frequently asked questions (FAQ) from students.


## Features

- User-friendly interface
- AI Chatbot assistant for personalized support
- Dynamic content generation based on student inquiries
- Insights and suggestions derived from FAQ data
- Enhanced learning experience for both educators and students

## Project Instructions

> Backend - Django

1. Move directory (from root directory)

```bash
  cd backend
```

2. Create a virtual environment

```bash
  python -m venv venv
```

3. Activate a virtual environment

```bash
  source venv/bin/activate
```

4. Install dependencies

```bash
  pip install -r requirements.txt
```

5. Run PostgreSQL db via Docker

```bash
  docker compose up
```

6. Run migration

```bash
  python manage.py makemigrations
  python manage.py migrate
```

7. Run backend server

```bash
  python3 manage.py runserver / python manage.py runserver
```

> Frontend - ViteJS

1. Move directory (from root directory)

```bash
  cd frontend
```

2. Install dependencies

```bash
  npm install
```

3. Run

```bash
  npm run dev
```

This project includes contributions from the following contributors:
#### - [raphaellaconsay](https://github.com/raphaellaconsay)
#### - [sebastianyebes](https://github.com/sebastianyebes)
#### - [kibyes123](https://github.com/kibyes123)
#### - [Amadeo0312](https://github.com/Amadeo0312)
#### - [Mauledby](https://github.com/Mauledby)

> All rights reserved 2024.
