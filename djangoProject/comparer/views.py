import json
from json import JSONDecodeError

from django.http import Http404, JsonResponse, HttpResponseNotFound, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Category, Playlist, Song
from .serializers import CategorySerializer, PlaylistSerializer, SongSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


#songs/
@api_view(['GET', 'POST'])
def handle_song(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            playlist_ids = data.get('playlist')
            if Playlist.objects.filter(id__in=playlist_ids).count() != len(playlist_ids):
                return JsonResponse({'success': False, 'error': f'Wrong playlist data'}, status=400)
            serializer = SongSerializer(data=data)
            serializer.validate(data)
            if serializer.is_valid():
                song = serializer.save(playlist=playlist_ids)
                return JsonResponse({'success': True, 'playlist': serializer.data}, status=201)
            else:
                return JsonResponse({'success': False, 'error': serializer.errors}, status=400)
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
            data = json.loads(request.body.decode('utf-8'))
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
@api_view(['GET', 'POST'])
def handle_playlist(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = PlaylistSerializer(data=data)
            serializer.validate(data)
            category_id = data.get('category')
            if serializer.is_valid():
                playlist = serializer.save(category_id=category_id)
                return JsonResponse({'success': True, 'playlist': serializer.data}, status=201)
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
            data = json.loads(request.body.decode('utf-8'))
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
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
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
            data = json.loads(request.body.decode('utf-8'))
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
            data = json.loads(request.body)
            serializer = PlaylistSerializer(data=data)
            serializer.validate(data)
            category_id = data.get('category')
            if category_id != pk:
                return JsonResponse({'success': False, 'error': "Body and URL category id mismatch"}, status=400)
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
            data = json.loads(request.body.decode('utf-8'))
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
            data = json.loads(request.body.decode('utf-8'))
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
            data = json.loads(request.body)
            serializertemp = SongSerializer(data=data)
            serializertemp.validate(data)
            playlists = []
            if 'playlist' in request.data:
                if isinstance(request.data.get('playlist'), list):
                    playlists = list(set(request.data.get('playlist')))
                else:
                    return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
            if int(cid) not in playlists:
                playlists.append(int(cid))

            data = {
                'name': request.data.get('name'),
                'artist': request.data.get('artist'),
                'year': request.data.get('year'),
                'genre': request.data.get('genre'),
                'playlist': playlists
            }

            serializer = SongSerializer(data=data)
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
