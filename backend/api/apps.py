from django.apps import AppConfig
from django.conf import settings


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        """
        Auto-create a Django superuser in environments where we can't run
        `createsuperuser` (e.g. Render free tier with no shell).

        Uses the following environment variables (optional):
        - DJANGO_SUPERUSER_USERNAME
        - DJANGO_SUPERUSER_EMAIL
        - DJANGO_SUPERUSER_PASSWORD
        """
        from django.contrib.auth import get_user_model

        User = get_user_model()

        if User.objects.filter(is_superuser=True).exists():
            return

        username = getattr(settings, "DJANGO_SUPERUSER_USERNAME", None) or "admin"
        email = getattr(settings, "DJANGO_SUPERUSER_EMAIL", None) or "admin@example.com"
        password = getattr(settings, "DJANGO_SUPERUSER_PASSWORD", None) or "admin123"

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
