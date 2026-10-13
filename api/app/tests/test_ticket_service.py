from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from app.models import Ticket
from app.services.ticket_service import TicketService

User = get_user_model()


class TicketServiceCreateTicketTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )

    def test_creates_ticket_with_expected_fields(self):
        ticket = TicketService.create_ticket(
            data={
                "title": "<b>Fix</b> &amp; <b>reopen</b>",
                "description": "&amp; &lt;b&gt;safe&lt;/b&gt;",
                "priority": "high",
            },
            user=self.user,
        )

        # NOTE: status is consumed by the service (defaults to open) and is
        # applied by the caller in the view layer.
        self.assertEqual(ticket.title, "Fix & reopen")
        self.assertEqual(ticket.description, "& safe")
        self.assertEqual(ticket.priority, "high")
        self.assertEqual(ticket.created_by, self.user)

    def test_creates_ticket_ignores_client_owned_by(self):
        ticket = TicketService.create_ticket(
            data={"title": "Owned ticket", "created_by": "attacker"},
            user=self.user,
        )

        self.assertEqual(ticket.created_by, self.user)

    def test_creates_ticket_sets_default_status_and_priority(self):
        ticket = TicketService.create_ticket(
            data={"title": "Default ticket"}, user=self.user
        )

        self.assertEqual(ticket.status, Ticket.Status.OPEN)
        self.assertEqual(ticket.priority, Ticket.Priority.Low)

    def test_raises_when_title_missing(self):
        with self.assertRaises(ValueError):
            TicketService.create_ticket(
                data={"title": ""}, user=self.user
            )

    def test_raises_when_title_exceeds_200_characters(self):
        long_title = "x" * 201

        with self.assertRaises(ValidationError):
            TicketService.create_ticket(
                data={"title": long_title}, user=self.user
            )


class TicketServiceListTicketsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )
        self.t1 = Ticket.objects.create(
            title="Fix bug", description="Bug fix", status="open", priority="low",
            created_by=self.user,
        )
        self.t2 = Ticket.objects.create(
            title="Close issue", description="Close work", status="closed", priority="high",
            created_by=self.user,
        )
        self.t3 = Ticket.objects.create(
            title="Other ticket", description="Not mine", status="open", priority="medium",
            created_by=self.user,
        )

    def test_returns_all_tickets_when_no_filters(self):
        tickets = TicketService.list_tickets(params={})

        self.assertEqual(len(tickets), 3)

    def test_filters_by_status(self):
        result = TicketService.list_tickets(params={"status": "open"})

        self.assertEqual(len(result), 2)
        self.assertEqual(set(t.status for t in result), {"open"})

    def test_filters_by_priority(self):
        result = TicketService.list_tickets(params={"priority": "high"})

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].priority, "high")

    def test_filters_by_search_in_title_or_description(self):
        result = TicketService.list_tickets(params={"search": "bug"})

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].title, "Fix bug")

    def test_combines_filters(self):
        result = TicketService.list_tickets(
            params={"status": "open", "priority": "low", "search": "bug"}
        )

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].id, self.t1.id)

    def test_search_is_case_insensitive(self):
        result = TicketService.list_tickets(params={"search": "BUG"})

        self.assertEqual(len(result), 1)

    def test_search_strips_whitespace(self):
        result = TicketService.list_tickets(params={"search": "  bug  "})

        self.assertEqual(len(result), 1)


class TicketServiceGetTicketTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )
        self.ticket = Ticket.objects.create(
            title="Find me", status="open", created_by=self.user
        )

    def test_returns_ticket_by_id(self):
        found = TicketService.get_ticket(self.ticket.id)

        self.assertEqual(found, self.ticket)

    def test_raises_when_ticket_not_found(self):
        with self.assertRaises(ValidationError):
            TicketService.get_ticket("00000000-0000-0000-0000-000000000000")


class TicketServiceUpdateTicketTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )
        self.ticket = Ticket.objects.create(
            title="Before", description="D", status="open", priority="low",
            created_by=self.user,
        )

    def test_updates_allowed_fields(self):
        updated = TicketService.update_ticket(
            ticket=self.ticket,
            data={"title": "After", "description": "New desc", "priority": "high"},
        )

        self.assertEqual(updated.title, "After")
        self.assertEqual(updated.description, "New desc")
        self.assertEqual(updated.priority, "high")

    def test_preserves_owner_and_status_on_update(self):
        original_title = self.ticket.title
        updated = TicketService.update_ticket(
            ticket=self.ticket, data={"title": "New title", "priority": "high"}
        )

        self.assertEqual(updated.created_by, self.user)
        self.assertEqual(updated.status, self.ticket.status)
        self.assertNotEqual(updated.title, original_title)

    def test_rejects_unexpected_fields(self):
        with self.assertRaises(ValidationError):
            TicketService.update_ticket(
                ticket=self.ticket,
                data={"status": "closed"},
            )

    def test_rejects_invalid_priority(self):
        with self.assertRaises(ValidationError):
            TicketService.update_ticket(
                ticket=self.ticket, data={"priority": "urgent"}
            )

    def test_rejects_empty_title(self):
        with self.assertRaises(ValueError):
            TicketService.update_ticket(
                ticket=self.ticket, data={"title": ""}
            )

    def test_rejects_title_exceeding_200_characters(self):
        long_title = "x" * 201

        with self.assertRaises(ValidationError):
            TicketService.update_ticket(
                ticket=self.ticket, data={"title": long_title}
            )


class TicketServiceUpdateStatusTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )
        self.ticket = Ticket.objects.create(
            title="Ticket", status="open", created_by=self.user
        )

    def test_updates_status(self):
        updated = TicketService.update_status(
            ticket=self.ticket, new_status="in_progress"
        )

        self.assertEqual(updated.status, "in_progress")

    def test_valid_status_values(self):
        for value in (
            Ticket.Status.OPEN,
            Ticket.Status.IN_PROGRESS,
            Ticket.Status.CLOSED,
        ):
            with self.subTest(status=value):
                updated = TicketService.update_status(
                    ticket=self.ticket, new_status=value
                )
                self.assertEqual(updated.status, value)

    def test_raises_for_invalid_status(self):
        with self.assertRaises(ValidationError):
            TicketService.update_status(
                ticket=self.ticket, new_status="done"
            )


class TicketServiceGetStatisticsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", password="pass", email="owner@example.com"
        )
        Ticket.objects.bulk_create(
            [
                Ticket(title="Open ticket", status="open", priority="low", created_by=self.user),
                Ticket(title="Open again", status="open", priority="medium", created_by=self.user),
                Ticket(title="In progress", status="in_progress", priority="high", created_by=self.user),
                Ticket(title="Closed ticket", status="closed", priority="low", created_by=self.user),
            ]
        )

    def test_returns_total_and_breakdown(self):
        stats = TicketService.get_statistics(params={})

        self.assertEqual(stats["total"], 4)
        self.assertEqual(stats["open"], 2)
        self.assertEqual(stats["in_progress"], 1)
        self.assertEqual(stats["closed"], 1)
