from rest_framework.exceptions import APIException


class MyCustomException(APIException):
    status_code = 400
    default_detail = 'Error'
