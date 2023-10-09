from rest_framework.views import exception_handler
from django.http import JsonResponse


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            'error': response.status_code,
            'message': response.data.get('detail', str(response.status_code)),
        }
        response.data = custom_response_data
        response.content_type = 'application/json'

    return response


def custom_404_view(request, exception):
    response_data = {
        'error': 'Not Found',
        'message': 'The requested resource was not found.'
    }
    return JsonResponse(data=response_data, status=404)
