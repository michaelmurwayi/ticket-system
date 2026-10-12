
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTicketOwnerOrReadOnly(BasePermission):
    """
    Authenticated users can read tickets.
    Only the ticket creator can modify a ticket.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.created_by_id == request.user.id
