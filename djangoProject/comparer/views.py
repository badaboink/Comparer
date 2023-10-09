import json
from json import JSONDecodeError

from django.http import Http404, JsonResponse, HttpResponseNotFound, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
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


@api_view(['GET', 'POST'])
def handle_category(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            category = Category(**data)
            serializer = CategorySerializer(category, data=request.data)
            if serializer.is_valid():
                category.save()
                return JsonResponse({'success': True, 'category': serializer.data}, status=201)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)

    elif request.method == 'GET':
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


class EmptyDataError(Exception):
    pass

@api_view(['GET', 'PATCH', 'DELETE'])
def handle_category_id(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return HttpResponseNotFound("Category not found")
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
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


@api_view(['GET', 'POST'])
def handle_playlist(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return HttpResponseNotFound("Category not found")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            category = Category.objects.get(id=pk)
            data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
                'category': pk,
            }

            serializer = PlaylistSerializer(data=data)
            if serializer.is_valid():
                playlist = serializer.save(category_id=pk)
                return JsonResponse({'success': True, 'playlist': data}, status=201)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (json.JSONDecodeError, KeyError, Category.DoesNotExist) as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    if request.method == 'GET':
        try:
            playlists = Playlist.objects.filter(category__id=pk)
            serializer = PlaylistSerializer(playlists, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


@csrf_exempt
@api_view(['GET', 'PATCH', 'DELETE'])
def handle_playlist_id(request, pk, cid):
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.get(pk=cid, category_id=pk)
    except Category.DoesNotExist:
        return HttpResponseNotFound("Category not found")
    except Playlist.DoesNotExist:
        return HttpResponseNotFound("Playlist not found")
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


@api_view(['GET', 'POST'])
def handle_song(request, pk, cid):
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.filter(pk=cid, category_id=pk)
    except Category.DoesNotExist:
        return HttpResponseNotFound("Category not found")
    except Playlist.DoesNotExist:
        return HttpResponseNotFound("Playlist not found")
    return handle_song_basic(cid, request)


def handle_song_basic(cid, request):
    if request.method == 'GET':
        try:
            songs = Song.objects.filter(playlist__id=cid)
            serializer = SongSerializer(songs, many=True)
            return JsonResponse(serializer.data, safe=False, status=200)
        except Song.DoesNotExist:
            return HttpResponseNotFound("Song not found")
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            playlists = []
            if 'playlist' in request.data:
                if isinstance(request.data.get('playlist'), list):
                    playlists = list(set(request.data.get('playlist')))
                else:
                    return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
            if cid not in playlists:
                playlists.append(cid)

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
                return JsonResponse({'success': True, 'song': data}, status=201)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (json.JSONDecodeError, KeyError, Category.DoesNotExist) as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)


@csrf_exempt
@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_id(request, pk, cid, tid):
    try:
        category = Category.objects.get(pk=pk)
        playlist = Playlist.objects.get(pk=cid, category_id=pk)
        song = Song.objects.get(pk=tid, playlist__id=cid)
    except Category.DoesNotExist:
        return HttpResponseNotFound("Category not found")
    except Playlist.DoesNotExist:
        return HttpResponseNotFound("Playlist not found")
    except Song.DoesNotExist:
        return HttpResponseNotFound("Song not found")
    except EmptyDataError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return handle_song_id_basic(request, song)


@api_view(['GET', 'POST'])
def handle_song_by_playlist(request, cid):
    try:
        playlist = Playlist.objects.filter(pk=cid)
    except Playlist.DoesNotExist:
        return HttpResponseNotFound("Playlist not found")
    return handle_song_basic(cid, request)


@csrf_exempt
@api_view(['GET', 'PATCH', 'DELETE'])
def handle_song_by_playlist_id(request, cid, tid):
    try:
        playlist = Playlist.objects.get(pk=cid)
        song = Song.objects.get(pk=tid, playlist__id=cid)
    except Playlist.DoesNotExist:
        return HttpResponseNotFound("Playlist not found")
    except Song.DoesNotExist:
        return HttpResponseNotFound("Song not found")
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
