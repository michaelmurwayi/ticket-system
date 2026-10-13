
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTicketOwnerOrReadOnly(BasePermission):
    """
    Authenticated users can read tickets.
    Only the ticket creator (or a superuser) can modify a ticket.
    Deleting a ticket is restricted to superusers only.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        is_superuser = bool(request.user and request.user.is_superuser)

        if request.method == "DELETE":
            return is_superuser

        return is_superuser or obj.created_by_id == request.user.id
