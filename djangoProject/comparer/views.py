from django.http import Http404
from rest_framework import viewsets, permissions, status
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


#prblm su create
class PlaylistByCategoryView(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        if Category.objects.filter(id=category_id).exists():
            if category_id:
                return Playlist.objects.filter(category__id=category_id)
            else:
                return Playlist.objects.all()
        else:
            raise Http404("Category not found")

    def perform_create(self, serializer):
        category_id = self.kwargs.get('category_id')
        print(category_id)
        try:
            category = Category.objects.get(id=category_id)
            serializer.save(category=category)
        except Category.DoesNotExist:
            raise Http404("Category not found")

    def create(self, request, *args, **kwargs):
        category_id = self.kwargs.get('category_id')

        playlist_data = {
            'name': request.data.get('name'),
            'description': request.data.get('description'),
            'category': category_id,
        }

        serializer = self.get_serializer(data=playlist_data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save(category_id=category_id)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SongsInPlaylistView(viewsets.ModelViewSet):
    serializer_class = SongSerializer

    def get_queryset(self):
        playlist_id = self.kwargs['playlist_id']
        if Playlist.objects.filter(id=playlist_id).exists():
            if playlist_id:
                return Song.objects.filter(playlist__id=playlist_id)
            else:
                return Song.objects.all()
        else:
            raise Http404("Playlist not found")

    def perform_create(self, serializer):
        playlist_id = self.kwargs.get('playlist_id')
        try:
            playlist = Playlist.objects.get(id=playlist_id)
            serializer.save()
            playlist.songs.add(serializer.instance)
        except Playlist.DoesNotExist:
            raise Http404("Playlist not found")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaylistByCategoryViewID(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        playlist_id = self.kwargs.get('playlist_id')

        try:
            playlist = Playlist.objects.get(category__id=category_id, id=playlist_id)
            return Playlist.objects.filter(id=playlist_id)
        except Playlist.DoesNotExist:
            raise Http404("Playlist not found in the specified category")

    def update(self, request, *args, **kwargs):
        category_id = self.kwargs.get('category_id')
        playlist_id = self.kwargs.get('playlist_id')

        try:
            category = Category.objects.get(id=category_id)
            playlist = Playlist.objects.get(category__id=category_id, id=playlist_id)
        except (Category.DoesNotExist, Playlist.DoesNotExist):
            raise Http404("Category or Playlist not found")

        serializer = self.get_serializer(playlist, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.delete()


class SongByPlaylistViewID(viewsets.ModelViewSet):
    serializer_class = SongSerializer

    def get_queryset(self):
        song_id = self.kwargs['song_id']
        playlist_id = self.kwargs['playlist_id']

        try:
            song = Song.objects.get(playlist__id=playlist_id, id=song_id)
            return Song.objects.filter(id=song_id)
        except Playlist.DoesNotExist:
            raise Http404("Playlist not found in the specified category")

    def perform_create(self, serializer):
        category_id = self.kwargs['category_id']
        playlist_id = self.kwargs['playlist_id']

        try:
            playlist = Playlist.objects.get(category__id=category_id, id=playlist_id)
            serializer.save()
        except Playlist.DoesNotExist:
            raise Http404("Playlist not found in the specified category")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
