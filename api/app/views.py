from django.shortcuts import render

from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
 
from app.models import Ticket
from app.serializers import TicketSerializer
from app.services.ticket_service import TicketService
from app.utilitis.responses import success_response
from app.pagination import TicketPagination
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication
from app.permissions import IsTicketOwnerOrReadOnly, SAFE_METHODS

class TicketViewSet(ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TicketPagination
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    permission_classes = [
        IsAuthenticated,
        IsTicketOwnerOrReadOnly,
    ]

    queryset = Ticket.objects.none()

    def get_queryset(self):
        if self.action in ("list", "statistics"):
            return TicketService.list_tickets(
                params=self.request.query_params,
                creator_id=self._list_creator_id(),
            )
        return Ticket.objects.select_related("created_by").all()

    def _list_creator_id(self):
        user = self.request.user
        return None if user.is_superuser else user.id
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket = TicketService.create_ticket(
            data=serializer.validated_data,
            user=request.user,
        )

        return success_response(
            data=TicketSerializer(ticket).data,
            message="Ticket created successfully.",
            status_code=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            data = self.get_serializer(page, many=True).data
            return Response({
                "success": True,
                "message": "Tickets retrieved successfully.",
                "data": data,
                "meta": {
                    "count": self.paginator.page.paginator.count,
                    "next": self.paginator.get_next_link(),
                    "previous": self.paginator.get_previous_link(),
                },
            })

        return success_response(
            data=self.get_serializer(queryset, many=True).data,
            message="Tickets retrieved successfully.",
        )

    def retrieve(self, request, *args, **kwargs):
        ticket = self.get_object()

        return success_response(
            data=self.get_serializer(ticket).data,
            message="Ticket retrieved successfully.",
        )

    def partial_update(self, request, *args, **kwargs):
        if "status" in request.data:
            raise ValidationError({
                "status": "Use the dedicated status endpoint."
            })

        ticket = self.get_object()
        serializer = self.get_serializer(
            ticket,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)

        ticket = TicketService.update_ticket(
            ticket=ticket,
            data=serializer.validated_data,
        )

        return success_response(
            data=self.get_serializer(ticket).data,
            message="Ticket updated successfully.",
        )

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied("Only superusers can delete tickets.")

        instance = self.get_object()
        instance.delete()

        return success_response(
            data=None,
            message="Ticket deleted successfully.",
            status_code=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get("status")

        if not isinstance(new_status, str):
            raise ValidationError({
                "status": "A valid status is required."
            })

        ticket = TicketService.update_status(
            ticket=ticket,
            new_status=new_status,
        )

        return success_response(
            data=self.get_serializer(ticket).data,
            message="Ticket status updated successfully.",
        )

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        data = TicketService.get_statistics(
            params=request.query_params,
            creator_id=self._list_creator_id(),
        )

        return success_response(
            data=data,
            message="Ticket statistics retrieved successfully.",
        )
