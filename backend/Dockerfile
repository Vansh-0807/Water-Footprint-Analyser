FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system packages needed for python dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev && rm -rf /var/lib/apt/lists/*

# install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy django project files
COPY . .

# collect static files (placeholder env var for GEMINI_API_KEY)
RUN GEMINI_API_KEY=placeholder python manage.py collectstatic --noinput

EXPOSE 8000

# Run migrations, seed demo user, then start Gunicorn
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py loaddata fixtures.json || true && python manage.py shell -c \"from django.contrib.auth.models import User; User.objects.filter(username='user').exists() or User.objects.create_user('user','demo@example.com','user',first_name='Demo',last_name='User')\" && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 4 --timeout 120"]