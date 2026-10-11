
from django.db.models import Count, Q

from app.models import Ticket


class TicketRepository:
    # Optimize queries by fetching the creator simultaneously
    @staticmethod
    def get_queryset():
        return Ticket.objects.select_related("created_by").all()

    # Get List of all tickets
    @classmethod
    def list_tickets(
        cls,
        *,
        status=None,
        priority=None,
        search=None,
    ):
        queryset = cls.get_queryset()

        if status:
            queryset = queryset.filter(status=status)

        if priority:
            queryset = queryset.filter(priority=priority)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
            )

        return queryset

    # Query ticket of a specific ID
    @classmethod
    def get_by_id(cls, ticket_id):
        return cls.get_queryset().filter(id=ticket_id).first()

    # Create a new ticket
    @staticmethod
    def create(data):
        return Ticket.objects.create(**data)

    # Update tickets. The function take new data and updates the existing ticket with the new data
    @staticmethod
    def update(ticket, data):
        for field, value in data.items():
            setattr(ticket, field, value)

        ticket.save()
        return ticket

    # Return ticket counts based on status
    @classmethod
    def get_statistics(cls, queryset=None):
        queryset = queryset if queryset is not None else cls.get_queryset()

        return queryset.aggregate(
            total=Count("id"),
            open=Count(
                "id",
                filter=Q(status=Ticket.Status.OPEN),
            ),
            in_progress=Count(
                "id",
                filter=Q(status=Ticket.Status.IN_PROGRESS),
            ),
            closed=Count(
                "id",
                filter=Q(status=Ticket.Status.CLOSED),
            ),
        )
