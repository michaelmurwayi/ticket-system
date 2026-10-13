"""Seed the basic dev users (user + admin) whenever migrations run."""

from django.core.management import call_command
from django.db import migrations


def seed_users(apps, schema_editor):
    # Reuse the management command so credentials are defined in one place.
    call_command("seed_users")


def unseed_users(apps, schema_editor):
    # Intentionally a no-op: rolling back a migration must not delete accounts.
    pass


class Migration(migrations.Migration):

    dependencies = [
        # The seeders create rows in the auth user table.
        ("auth", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_users, unseed_users),
    ]
