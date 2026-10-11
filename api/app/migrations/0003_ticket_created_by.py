import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("app", "0002_ticket_app_ticket_status_381254_idx_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ticket",
            name="priority",
            field=models.CharField(
                choices=[("low", "LOW"), ("medium", "MEDIUM"), ("high", "HIGH")],
                default="low",
                max_length=200,
            ),
        ),
        migrations.AddField(
            model_name="ticket",
            name="created_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tickets",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
