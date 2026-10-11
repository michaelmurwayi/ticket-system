
from django.db.models import Count, Q

from app.models import Ticket


class TicketRepository:
    @staticmethod
    def get_queryset():
        return Ticket.objects.select_related("created_by").all()

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

    @classmethod
    def get_by_id(cls, ticket_id):
        return cls.get_queryset().filter(id=ticket_id).first()

    @staticmethod
    def create(data):
        return Ticket.objects.create(**data)

    @staticmethod
    def update(ticket, data):
        for field, value in data.items():
            setattr(ticket, field, value)

        ticket.save()
        return ticket

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
