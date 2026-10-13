
from django.db import transaction
from rest_framework.exceptions import ValidationError

from app.models import Ticket
from app.repositories.ticket_repository import TicketRepository
from app.utilitis.sanitizers import Preprocessing

Preprocessing = Preprocessing()

sanitize_ticket_data = Preprocessing.sanitize_ticket_data

class TicketService:
    @staticmethod
    @transaction.atomic
    def create_ticket(*, data, user):
        cleaned_data = sanitize_ticket_data(data)

        if not cleaned_data.get("title"):
            raise ValidationError({
                "title": "Title is required."
            })

        if len(cleaned_data["title"]) > 200:
            raise ValidationError({
                "title": "Title cannot exceed 200 characters."
            })

        # Never accept ownership or status from client input.
        cleaned_data.pop("created_by", None)
        cleaned_data.pop("status", None)
        cleaned_data.pop("id", None)
        cleaned_data.pop("created_at", None)
        cleaned_data.pop("updated_at", None)

        return TicketRepository.create({
            **cleaned_data,
            "created_by": user,
        })

    @staticmethod
    def list_tickets(*, params, creator_id=None):
        return TicketRepository.list_tickets(
            status=params.get("status"),
            priority=params.get("priority"),
            search=params.get("search", "").strip(),
            creator_id=creator_id,
        )

    @staticmethod
    def get_ticket(ticket_id):
        ticket = TicketRepository.get_by_id(ticket_id)

        if ticket is None:
            raise ValidationError({
                "ticket": "Ticket not found."
            })

        return ticket

    @staticmethod
    @transaction.atomic
    def update_ticket(*, ticket, data):
        cleaned_data = sanitize_ticket_data(data)

        allowed_fields = {
            "title",
            "description",
            "priority",
        }

        unexpected = set(cleaned_data) - allowed_fields

        if unexpected:
            raise ValidationError({
                field: "This field cannot be updated here."
                for field in sorted(unexpected)
            })

        if "title" in cleaned_data:
            title = cleaned_data["title"]

            if not title:
                raise ValidationError({
                    "title": "Title cannot be empty."
                })

            if len(title) > 200:
                raise ValidationError({
                    "title": "Title cannot exceed 200 characters."
                })

        if "priority" in cleaned_data:
            valid_priorities = {
                value for value, _ in Ticket.Priority.choices
            }

            if cleaned_data["priority"] not in valid_priorities:
                raise ValidationError({
                    "priority": "Invalid priority."
                })

        return TicketRepository.update(ticket, cleaned_data)

    @staticmethod
    @transaction.atomic
    def update_status(*, ticket, new_status):
        valid_statuses = {
            value for value, _ in Ticket.Status.choices
        }

        if new_status not in valid_statuses:
            raise ValidationError({
                "status": "Invalid ticket status."
            })

        return TicketRepository.update(
            ticket,
            {"status": new_status},
        )

    @staticmethod
    def get_statistics(*, params, creator_id=None):
        tickets = TicketService.list_tickets(
            params=params,
            creator_id=creator_id,
        )

        return TicketRepository.get_statistics(tickets)
