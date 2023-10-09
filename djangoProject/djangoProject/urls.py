from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers

from comparer import views
router = routers.DefaultRouter()
router.register(r'playlist', views.PlaylistViewSet)
router.register(r'song', views.SongViewSet)

# todo:
# postman
# email
urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^categories/?$', views.handle_category, name='handle_category'),
    re_path(r'^categories/(?P<pk>\d+)/?$', views.handle_category_id, name='handle_category_id'),

    re_path(r'categories/(?P<pk>\d+)/playlists/?$', views.handle_playlist, name='handle_playlist'),
    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/?$', views.handle_playlist_id, name='handle_playlist_id'),

    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/?$', views.handle_song, name='handle_song'),
    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/(?P<tid>\d+)/?$', views.handle_song_id,
         name='handle_song_id'),

    re_path(r'playlists/(?P<cid>\d+)/songs/?$', views.handle_song_by_playlist, name='handle_song'),
    re_path(r'playlists/(?P<cid>\d+)/songs/(?P<tid>\d+)/?$', views.handle_song_by_playlist_id,
         name='handle_song_id'),

    path('admin/', admin.site.urls),
]