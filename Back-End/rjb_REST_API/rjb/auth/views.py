from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login(request):
    data = {
        "message": "Login successful",
        "status": "success"
    }
    return Response(data)

@api_view(['POST'])
def register(request):
    data = {
        "message": "Registration successful",
        "status": "success"
    }
    return Response(data)