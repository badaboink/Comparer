from django.http import JsonResponse
from django.http.response import Http404, HttpResponseNotFound


class Custom404Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Check if the response is a 404 error
        if isinstance(response, HttpResponseNotFound):
            response_data = {
                'error': 'Not Found',
                'message': 'The requested resource was not found.'
            }
            response = JsonResponse(data=response_data, status=404)

        return response
