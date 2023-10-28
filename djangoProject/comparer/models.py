from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='playlists')
    image = models.ImageField(upload_to='playlists/', null=True, blank=True)
    playlist_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')

    def __str__(self):
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField(null=True, default=None)
    genre = models.CharField(max_length=50)
    playlist = models.ManyToManyField('Playlist', related_name='songs')
    artwork = models.ImageField(upload_to='artworks/', null=True, blank=True)
    song_file = models.FileField(upload_to='songs/', null=True, blank=True)
    song_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='songs')

    def __str__(self):
        return f"{self.name} by {self.artist}"


# class Genre(models.Model):
#     name = models.CharField(max_length=50)
#
#     def __str__(self):
#         return self.name
