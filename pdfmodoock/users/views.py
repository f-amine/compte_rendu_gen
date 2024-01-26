from django.shortcuts import render
from django.http import JsonResponse
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
import jwt
import datetime
from rest_framework.decorators import api_view
import secrets
import hashlib
from rest_framework.exceptions import AuthenticationFailed
# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({'message': 'registered successfully', 'status': 200})
        else:
            print(serializer.errors)
            return JsonResponse({'message': 'Invalid Credentials', 'status': 401})
class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        print(f"Username: {username}, Password: {password}")  # Debug print

        user = User.objects.filter(username=username).first()
        print(f"User: {user}")  # Debug print
        if user is None:
            return JsonResponse(({'message' : 'Invalid Credentials',
                    'status':401}))
        if not user.check_password(password):
            return JsonResponse(({'message' : 'Invalid Credentials',
                    'status':401}))
        payload = {
            'id': user.id,
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat':  datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, 'PLEASE WORK', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token,
             'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'message' : 'login successfully',
            'status':200
        }
        return JsonResponse(response.data)
class LogoutView(APIView):
    def post(self,request):
        response =Response()
        response.delete_cookie('jwt')
        response.data={
            'message':'Logged out Succesfully','status':200}
        return response
    
class UserView(APIView):
    def post(self, request):
        token = request.data['jwt']
        if not token:
            return JsonResponse(({'message' : 'Invalid Credentials',
                    'status':401}))
        try:
            payload = jwt.decode(token,'PLEASE WORK',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return JsonResponse(({'message' : 'Invalid Credentials',
                    'status':401}))
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
@api_view(['GET'])
def userList(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    data = {
        'users': serializer.data,
        'message': 'Users listed successfully',
        'status': 200
    }
    return JsonResponse(data)

class TokenValidationView(APIView):
    def get(self, request, jwt_token):
        if not jwt_token:
            return Response({'message': 'not valid', 'status': 401})
        try:
            payload = jwt.decode(jwt_token, 'PLEASE WORK', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'message': 'not valid', 'status': 401})
        except jwt.InvalidSignatureError:
            return Response({'message': 'not valid', 'status': 401})
        return Response({'message': 'valid', 'status': 200})