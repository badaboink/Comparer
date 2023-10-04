from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from comparer import views

router = routers.DefaultRouter()
router.register(r'category', views.CategoryViewSet)
router.register(r'playlist', views.PlaylistViewSet)
router.register(r'song', views.SongViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('playlists/by-category/', views.PlaylistByCategoryView.as_view({'get': 'list'}), name='playlist-by-category'),
    path('songs/by-playlist/', views.SongsInPlaylistView.as_view({'get': 'list'}), name='songs-by-playlist'),
]
