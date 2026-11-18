#!/bin/sh
set -e

# If an external database (e.g. Postgres via DATABASE_URL) is configured, ensure it is migrated and seeded
if [ -n "$DATABASE_URL" ]; then
  python manage.py migrate --noinput
  python manage.py loaddata fixtures.json || true
  python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='user').exists() or User.objects.create_user('user', 'demo@example.com', 'user', first_name='Demo', last_name='User')" || true
fi

exec gunicorn --bind "0.0.0.0:${PORT:-8080}" --workers 1 --threads 8 --timeout 0 core.wsgi:application
