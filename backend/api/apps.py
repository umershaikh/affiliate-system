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

        username = getattr(settings, "DJANGO_SUPERUSER_USERNAME", None) or "admin"
        email = getattr(settings, "DJANGO_SUPERUSER_EMAIL", None) or "admin@example.com"
        password = getattr(settings, "DJANGO_SUPERUSER_PASSWORD", None) or "admin123"

        # Ensure a superuser with this username exists and has the configured password.
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        # Always enforce superuser/staff flags and password on startup.
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
