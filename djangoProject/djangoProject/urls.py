from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers

from comparer import views

router = routers.DefaultRouter()
router.register(r'category', views.CategoryViewSet)
router.register(r'playlist', views.PlaylistViewSet)
router.register(r'song', views.SongViewSet)
router.register(r'category/(?P<category_id>[0-9]+)/playlist', views.PlaylistByCategoryView, basename='playlist-by-category')
router.register(r'playlist/(?P<playlist_id>[0-9]+)/song', views.SongsInPlaylistView, basename='song-by-playlist')
# router.register(
#     r'category/(?P<category_id>[0-9]+)/playlist/(?P<playlist_id>[0-9]+)',
#     views.PlaylistByCategoryViewID,
#     basename='playlist-by-category-id'
# )

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
