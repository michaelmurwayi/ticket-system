
from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(
        source="created_by.username"
    )

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "created_by",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_by",
            "created_at",
        ]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Title cannot be empty."
            )

        return value

    def validate_description(self, value):
        return value.strip()
