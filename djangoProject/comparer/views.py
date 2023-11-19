import json
from datetime import timedelta, datetime

import jwt
from django.conf import settings
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError

from .models import Category, Playlist, Song
from .serializers import CategorySerializer, PlaylistSerializer, SongSerializer


# register
@transaction.atomic
def user_register(request):
    user = request.user
    if not user.groups.exists() or user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            try:
                request_data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)

            form = UserCreationForm(request_data)
            if form.is_valid():
                user = form.save()
                user.email = request_data.get('email')

                group, created = Group.objects.get_or_create(name='Normal')
                user.groups.add(group)

                user_group = user.groups.first()
                user_role = user_group.name if user_group else None
                expiration_time = datetime.utcnow() + timedelta(days=30)

                payload = {
                    'username': user.username,
                    'role': user_role,
                    'exp': expiration_time
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                login(request, user)
                return JsonResponse({'success': True, 'token': token}, status=200)

            errors = dict(form.errors)
            return JsonResponse({'success': False, 'error': errors}, status=400)

        return JsonResponse({'success': False, 'error': 'Only POST requests are allowed for user registration'}, status=405)
    return JsonResponse({'success': False, 'error': 'Access denied. You must be an admin or not logged in to register users.'}, status=403)


@transaction.atomic
def user_login(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            return JsonResponse({'success': False, 'error': 'You are already logged in'}, status=400)
        try:
            request_data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)

        username = request_data.get('username')
        password = request_data.get('password')
        checked = request_data.get('checked')

        if not username or not password:
            return JsonResponse({'success': False, 'error': 'Username and password are required'}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            user_group = user.groups.first()
            user_role = user_group.name if user_group else None
            if checked:
                expiration_time = datetime.utcnow() + timedelta(days=30)
            else:
                expiration_time = datetime.utcnow() + timedelta(days=1)
            payload = {
                'username': user.username,
                'role': user_role,
                'exp': expiration_time
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            login(request, user)
            return JsonResponse({'success': True, 'token': token}, status=200)
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'success': False, 'error': 'Only POST requests are allowed for user login'}, status=405)


def user_logout(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'success': False, 'success': 'Logout successful'}, status=200)
        else:
            return JsonResponse({'success': False, 'error': 'You are not logged in'}, status=401)

    return JsonResponse({'success': False, 'error': 'Only POST requests are allowed for user logout'}, status=405)


def check_login_status(request):
    if request.user.is_authenticated:
        return JsonResponse({'isLoggedIn': True})
    else:
        return JsonResponse({'isLoggedIn': False})


#viewsets
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    required_scopes = ['categories']


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


def check_jwt_token(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=401)
    if token.startswith('Bearer '):
        token = token[7:]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        response_data = {
            'username': payload.get('username'),
            'role': payload.get('role')
        }
        return response_data
    except jwt.ExpiredSignatureError:
        return JsonResponse({'success': False, 'error': 'Token has expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'success': False, 'error': 'Invalid token'}, status=401)


#songs/
@transaction.atomic
@api_view(['GET', 'POST'])
def handle_song(request):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    if request.method == 'POST':
        try:
            data = request.data
            playlist_ids = data.get('playlist')
            if playlist_ids:
                error_response = validate_playlists_owner(request.data.get('playlists', []), response_content['username'])
                if error_response:
                    return error_response

                serializer = SongSerializer(data=request.data, context={'request': request})
                serializer.validate(data)

                if serializer.is_valid():
                    song = serializer.save(playlist=playlist_ids, song_owner=request.user)
                    return JsonResponse({'success': True, 'playlist': serializer.data}, status=201)
                else:
                    return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
            else:
                return JsonResponse({'success': False, 'error': 'No playlist IDs provided.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    elif request.method == 'GET':
        try:
            songs = Song.objects.all()
            serializer = SongSerializer(songs, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_id(request, pk):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        song = Song.objects.get(pk=pk)
    except Song.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Song not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

    if request.method == 'GET':
        serializer = SongSerializer(song)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'DELETE':
        error_response = own_or_admin(song.song_owner.username, response_content['username'], response_content['role'])
        if error_response:
            return error_response
        if request.user.username != song.song_owner.username or not request.user.groups.filter(name='Admin').exists():
            return JsonResponse({'success': False, 'error': 'Song does not belong to you.'}, status=403)
        song.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
            error_response = own_or_admin(song.song_owner.username, response_content['username'], response_content['role'])
            playlists_owner_error = validate_playlists_owner(request.data.get('playlists', []), response_content['username'])
            if error_response or playlists_owner_error:
                errors = {}
                if error_response:
                    errors.update(error_response)
                if playlists_owner_error:
                    errors.update(playlists_owner_error)
                return JsonResponse(errors, status=400)
            data = json.loads(request.data.decode('utf-8'))
            if not data:
                return JsonResponse({'success': False, 'error': 'Empty data in PATCH request'}, status=400)
            if data.get('playlist'):
                playlist_ids = data.get('playlist')
                if Playlist.objects.filter(id__in=playlist_ids).count() != len(playlist_ids):
                    return JsonResponse({'success': False, 'error': f'Wrong playlist data'}, status=400)
            serializer = SongSerializer(song, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


#playlists/
@transaction.atomic
@api_view(['GET', 'POST'])
def handle_playlist(request):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    if request.method == 'POST':
        try:
            serializer = PlaylistSerializer(data=request.data, context={'request': request})
            category_id = request.data.get('category')
            if serializer.is_valid():
                playlist = serializer.save(category_id=category_id)
                return JsonResponse(
                    {'success': True, 'playlist': serializer.data},
                    status=201)
            else:
                return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except Category.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    elif request.method == 'GET':
        try:
            playlists = Playlist.objects.all()
            serializer = PlaylistSerializer(playlists, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_playlist_id(request, pk):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        playlist = Playlist.objects.get(pk=pk)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

    if request.method == 'GET':
        serializer = PlaylistSerializer(playlist)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'DELETE':
        error_response = own_or_admin(playlist.playlist_owner.username, response_content['username'], response_content['role'])
        if error_response:
            return error_response
        playlist.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
            error_response = own_or_admin(playlist.playlist_owner.username, response_content['username'], response_content['role'])
            if error_response:
                return error_response
            data = request.data
            if not data:
                return JsonResponse({'success': False, 'error': 'Empty data in PATCH request'}, status=400)
            if data.get('category'):
                category_id = data.get('category')
                category = Category.objects.get(id=category_id)
            serializer = PlaylistSerializer(playlist, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except Category.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


#categories/
@api_view(['GET', 'POST'])
def handle_category(request):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    if request.method == 'POST':
        try:
            error_response = require_admin_access(response_content['role'])
            if error_response:
                return error_response
            data = request.data
            serializer = CategorySerializer(data=request.data)
            serializer.validate(data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'success': True, 'category': serializer.data}, status=201)
            else:
                return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    elif request.method == 'GET':
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


class EmptyDataError(Exception):
    pass


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_category_id(request, pk):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'DELETE':
        error_response = require_admin_access(response_content['role'])
        if error_response:
            return error_response
        category.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
            error_response = require_admin_access(response_content['role'])
            if error_response:
                return error_response
            data = request.data
            if not data:
                return JsonResponse({'success': False, 'error': 'Empty data in PATCH request'}, status=400)

            serializer = CategorySerializer(category, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


#categories/(?P<pk>\d+)/playlists/
@api_view(['GET', 'POST'])
def handle_playlist_hierarchy(request, pk):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    if request.method == 'POST':
        try:
            data = request.data
            category_id = data.get('category')
            if not category_id:
                data['category'] = category.pk
            if category_id != pk:
                data['category'] = category.pk

            serializer = PlaylistSerializer(data=data, context={'request': request})
            serializer.validate(data)
            if serializer.is_valid():
                playlist = serializer.save(category_id=pk)
                return JsonResponse({'success': True, 'playlist': serializer.data}, status=201)
            else:
                return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
        except (json.JSONDecodeError, KeyError, Category.DoesNotExist) as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    if request.method == 'GET':
        try:
            playlists = Playlist.objects.filter(category__id=pk)
            serializer = PlaylistSerializer(playlists, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


def require_admin_access(role):
    if role != "Admin":
        return JsonResponse({'success': False, 'error': 'You must be an admin to access this method.'}, status=403)
    return None


def own_or_admin(owner, username, role):
    if username != owner or role != "Admin":
        return JsonResponse({'success': False, 'error': 'You must be an admin to access this method.'}, status=403)
    return None


def validate_playlists_owner(playlists, username):
    for playlist_id in playlists:
        playlist_data = Playlist.objects.filter(pk=playlist_id)
        if playlist_data.get().playlist_owner.username != username:
            return JsonResponse({'success': False, 'error': 'Invalid playlist_owner for one or more playlists.'},
                                status=403)
    return None


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_playlist_hierarchy_id(request, pk, cid):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.get(pk=cid, category_id=pk)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

    if request.method == 'GET':
        serializer = PlaylistSerializer(playlist)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'PATCH':
        try:
            error_response = own_or_admin(playlist.playlist_owner.username, response_content['username'], response_content['role'])
            if error_response:
                return error_response
            data = request.data
            if not data:
                return JsonResponse({'success': False, 'error': 'Empty data in PATCH request'}, status=400)
            serializer = PlaylistSerializer(playlist, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    elif request.method == 'DELETE':
        error_response = own_or_admin(playlist.playlist_owner.username, response_content['username'], response_content['role'])
        if error_response:
            return error_response
        playlist.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)


#categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/
@api_view(['GET', 'POST'])
def handle_song_hierarchy(request, pk, cid):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.filter(pk=cid, category_id=pk)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    return handle_song_basic(cid, request)


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_hierarchy_id(request, pk, cid, tid):
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.get(pk=cid, category_id=pk)
        song = Song.objects.get(pk=tid, playlist__id=cid)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    except Song.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Song not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return handle_song_id_basic(request, song)


# playlists/(?P<cid>\d+)/songs/
@api_view(['GET', 'POST'])
def handle_song_by_playlist(request, cid):
    try:
        playlist = Playlist.objects.filter(pk=cid)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    return handle_song_basic(cid, request)


@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_by_playlist_id(request, cid, tid):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    try:
        playlist = Playlist.objects.get(pk=cid)
        song = Song.objects.get(pk=tid, playlist__id=cid)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    except Song.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Song not found'}, status=400)
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return handle_song_id_basic(request, song)


def handle_song_id_basic(request, song):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    if request.method == 'GET':
        serializer = SongSerializer(song)
        return JsonResponse(serializer.data, safe=False, status=200)
    elif request.method == 'PATCH':
        try:
            error_response = own_or_admin(song.song_owner.username, response_content['username'], response_content['role'])
            playlists_owner_error = validate_playlists_owner(request.data.get('playlists', []), response_content['username'])
            if error_response or playlists_owner_error:
                errors = {}
                if error_response:
                    errors.update(error_response)
                if playlists_owner_error:
                    errors.update(playlists_owner_error)
                return JsonResponse(errors, status=403)
            data = request.data
            if not data:
                return JsonResponse({'success': False, 'error': 'Empty data in PATCH request'}, status=400)
            serializer = SongSerializer(song, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    elif request.method == 'DELETE':
        error_response = own_or_admin(song.song_owner.username, response_content['username'], response_content['role'])
        if error_response:
            return error_response
        song.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


def handle_song_basic(cid, request):
    response_content = check_jwt_token(request)
    if isinstance(response_content, JsonResponse):
        return response_content
    if request.method == 'GET':
        try:
            songs = Song.objects.filter(playlist__id=cid)
            serializer = SongSerializer(songs, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except Song.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Song not found'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)

    elif request.method == 'POST':
        try:
            data = request.data
            playlists = []
            if 'playlist' in data:
                if isinstance(data.get('playlist'), list):
                    playlists = list(set(data.get('playlist')))
                else:
                    return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
            if int(cid) not in playlists:
                playlists.append(int(cid))
            error_response = validate_playlists_owner(playlists, response_content['username'])
            if error_response:
                return error_response

            data = {
                'name': request.data.get('name'),
                'artist': request.data.get('artist'),
                'year': request.data.get('year'),
                'genre': request.data.get('genre'),
                'playlist': playlists
            }
            serializer = SongSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                song = serializer.save()
                song.playlist.set(playlists)
                return JsonResponse({'success': True, 'song': serializer.data}, status=201)
            else:
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (json.JSONDecodeError, KeyError, Category.DoesNotExist) as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)

