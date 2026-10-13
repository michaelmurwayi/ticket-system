import uuid

from django.conf import settings
from django.db import models

# Create your models here.
class Ticket(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "OPEN"
        IN_PROGRESS = "in_progress", "IN_PROGRESS"
        CLOSED = "closed", "CLOSED"

    class Priority( models.TextChoices):
        Low = "low", "LOW"
        MEDIUM = "medium", "MEDIUM"
        HIGH = "high", "HIGH"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=200,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True
    )
    priority = models.CharField(
        max_length=200,
        choices=Priority.choices,
        default=Priority.Low,
        
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["priority", "-created_at"]),
        ]

    def _str_(self):
        return self.title