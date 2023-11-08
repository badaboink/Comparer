from django.contrib import admin
from django.urls import path, re_path

from comparer import views

urlpatterns = [
    path('admin/', admin.site.urls),

    re_path(r'^songs/?$', views.handle_song, name='handle_song'),
    re_path(r'^songs/(?P<pk>\d+)/?$', views.handle_song_id, name='handle_song_id'),

    re_path(r'^playlists/?$', views.handle_playlist, name='handle_playlist'),
    re_path(r'^playlists/(?P<pk>\d+)/?$', views.handle_playlist_id, name='handle_playlist_id'),

    re_path(r'^categories/?$', views.handle_category, name='handle_category'),
    re_path(r'^categories/(?P<pk>\d+)/?$', views.handle_category_id, name='handle_category_id'),

    re_path(r'categories/(?P<pk>\d+)/playlists/?$', views.handle_playlist_hierarchy, name='handle_playlist'),
    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/?$', views.handle_playlist_hierarchy_id, name='handle_playlist_id'),

    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/?$', views.handle_song_hierarchy, name='handle_song'),
    re_path(r'categories/(?P<pk>\d+)/playlists/(?P<cid>\d+)/songs/(?P<tid>\d+)/?$', views.handle_song_hierarchy_id,
         name='handle_song_id'),

    re_path(r'playlists/(?P<cid>\d+)/songs/?$', views.handle_song_by_playlist, name='handle_song'),
    re_path(r'playlists/(?P<cid>\d+)/songs/(?P<tid>\d+)/?$', views.handle_song_by_playlist_id,
         name='handle_song_id'),

    re_path(r'register/?$', views.user_register, name='user_register'),
    re_path(r'login/?$', views.user_login, name='user_login'),
    re_path(r'logout/?$', views.user_logout, name='user_logout'),
]