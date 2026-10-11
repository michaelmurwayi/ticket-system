
from django.db.models import Q
from rest_framework.exceptions import ValidationError

from .models import Ticket


def filter_tickets(queryset, params):
    status_value = params.get("status")
    priority_value = params.get("priority")
    search = params.get("search", "").strip()

    valid_statuses = {
        value for value, _ in Ticket.Status.choices
    }
    valid_priorities = {
        value for value, _ in Ticket.Priority.choices
    }

    if status_value and status_value not in valid_statuses:
        raise ValidationError({
            "status": f"Invalid status. Choose from: "
            f"{', '.join(sorted(valid_statuses))}."
        })

    if priority_value and priority_value not in valid_priorities:
        raise ValidationError({
            "priority": f"Invalid priority. Choose from: "
            f"{', '.join(sorted(valid_priorities))}."
        })

    if status_value:
        queryset = queryset.filter(status=status_value)

    if priority_value:
        queryset = queryset.filter(priority=priority_value)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search)
            | Q(description__icontains=search)
        )

    return queryset
