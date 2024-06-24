from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def test_json(request):
    # Test JSON data
    data = {
        "message": "Hello, this is a test JSON response!",
        "status": "success"
    }
    return Response(data)
