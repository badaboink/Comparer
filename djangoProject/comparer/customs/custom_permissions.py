from rest_framework import permissions


class CanAccessGroups(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('comparer.access_groups')


class CustomUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.groups.filter(name='Admin').exists():
            return True
        elif user.groups.filter(name='Normal').exists():
            if view.action in ['create', 'update', 'partial_update']:
                return True
            elif view.action == 'destroy':
                return str(user.id) == request.parser_context['kwargs']['pk']
        elif not user.is_authenticated and view.action == 'create':
            return True
        return False
