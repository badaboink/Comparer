import json

from django.contrib.auth.forms import UserCreationForm
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from .models import Category, Playlist, Song
from .serializers import CategorySerializer, PlaylistSerializer, SongSerializer, GroupSerializer
from oauth2_provider.contrib.rest_framework import TokenHasScope
from django.contrib.auth.models import Group

from .customs import custom_permissions


# register
# will remover csrf exemption when adding front
@csrf_exempt
@transaction.atomic
def UserRegister(request):
    user = request.user
    if not user.groups.exists() or user.groups.filter(name='Admin').exists():

        if request.method == 'POST':
            try:
                request_data = json.loads(request.data.decode('utf-8'))
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)

            form = UserCreationForm(request_data)
            if form.is_valid():
                user = form.save()

                group, created = Group.objects.get_or_create(name='Normal')
                user.groups.add(group)

                return JsonResponse({'message': 'User registered successfully'})

            errors = dict(form.errors)
            return JsonResponse({'errors': errors}, status=400)

        return JsonResponse({'message': 'Only POST requests are allowed for user registration'}, status=405)
    return JsonResponse({'message': 'Access denied. You must be an admin or not logged in to register users.'}, status=403)


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


class GroupList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, custom_permissions.CanAccessGroups, TokenHasScope]
    required_scopes = ['groups']
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


#songs/
@transaction.atomic
@api_view(['GET', 'POST'])
def handle_song(request):
    if request.method == 'POST':
        try:
            data = request.data
            playlist_ids = data.get('playlist')
            if playlist_ids:
                invalid_playlists = Playlist.objects.filter(id__in=playlist_ids).exclude(playlist_owner=request.user)

                if invalid_playlists.exists() and not request.user.groups.filter(name='Admin').exists():
                    return JsonResponse({'success': False, 'error': 'Some playlists do not belong to you.'}, status=400)

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
        song.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
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
        playlist.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
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
    if request.method == 'POST' and request.user.groups.filter(name='Admin').exists():
        try:
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
        category.delete()
        return HttpResponse(status=204)

    elif request.method == 'PATCH':
        try:
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
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


@csrf_exempt
@api_view(['GET', 'PATCH', 'DELETE'])
def handle_playlist_hierarchy_id(request, pk, cid):
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
        playlist.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


#categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/
@api_view(['GET', 'POST'])
def handle_song_hierarchy(request, pk, cid):
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.filter(pk=cid, category_id=pk)
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'}, status=400)
    except Playlist.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Playlist not found'}, status=400)
    return handle_song_basic(cid, request)


@csrf_exempt
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


@csrf_exempt
@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_by_playlist_id(request, cid, tid):
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
    if request.method == 'GET':
        serializer = SongSerializer(song)
        return JsonResponse(serializer.data, safe=False, status=200)
    elif request.method == 'PATCH':
        try:
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
        song.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


def handle_song_basic(cid, request):
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

            invalid_playlists = Playlist.objects.filter(id__in=playlists).exclude(playlist_owner=request.user)
            if invalid_playlists.exists() and not request.user.groups.filter(name='Admin').exists():
                return JsonResponse({'success': False, 'error': 'Some playlists do not belong to you.'}, status=400)

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

