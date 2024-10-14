web: pip install -r backend/requirements.txt && \
     python backend/manage.py makemigrations && \
     python backend/manage.py migrate && \
     cd backend && gunicorn backend_django.wsgi:application
