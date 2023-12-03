import os

from django.core.files.base import ContentFile
from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=150)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='playlists')
    image = models.ImageField(upload_to='playlists/', null=True, blank=True)
    playlist_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')

    def __str__(self):
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField(null=True, default=None)
    playlist = models.ManyToManyField('Playlist', related_name='songs')
    artwork = models.ImageField(upload_to='', null=True, blank=True)
    song_file = models.FileField(upload_to='songs/', null=True, blank=True)
    song_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='songs')

    def __str__(self):
        return f"{self.name} by {self.artist}"

    def save(self, *args, **kwargs):
        if 'artwork' in kwargs:
            artwork_file = kwargs['artwork']

            normalized_artwork_path = os.path.normpath(artwork_file.name)

            artwork_content = artwork_file.read()
            self.artwork.save(normalized_artwork_path, ContentFile(content=artwork_content), save=False)

        super().save(*args, **kwargs)
