FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed by some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Pre-build static files and pre-seed SQLite DB (crops, soils, recruiter demo user)
RUN USE_SQLITE=1 python manage.py collectstatic --noinput && \
    USE_SQLITE=1 python manage.py migrate --noinput && \
    USE_SQLITE=1 python manage.py loaddata fixtures.json && \
    USE_SQLITE=1 python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='user').exists() or User.objects.create_user('user', 'demo@example.com', 'user', first_name='Demo', last_name='User')"

# Strip any Windows CRLF line endings and make startup script executable
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

EXPOSE 8080

CMD ["/app/start.sh"]
