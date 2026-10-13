from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

# Basic dev credentials. Override with environment-specific values before
# running outside of local development.
SEED_USERS = [
    {
        "username": "user",
        "email": "user@example.com",
        "password": "user12345",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "username": "admin",
        "email": "admin@example.com",
        "password": "admin12345",
        "is_staff": True,
        "is_superuser": True,
    },
]


class Command(BaseCommand):
    help = "Seed a basic user and an admin (superuser) user."

    def handle(self, *args, **options):
        for attrs in SEED_USERS:
            user, created = User.objects.get_or_create(
                username=attrs["username"],
                defaults={
                    "email": attrs["email"],
                    "is_staff": attrs["is_staff"],
                    "is_superuser": attrs["is_superuser"],
                },
            )

            if created:
                user.set_password(attrs["password"])
                user.save(update_fields=["password"])
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created {self.role(user)} '{user.username}'."
                    )
                )
            else:
                self.stdout.write(
                    f"Skipped {self.role(user)} '{user.username}' (already exists)."
                )

    @staticmethod
    def role(user):
        return "admin user" if user.is_superuser else "user"
