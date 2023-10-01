from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='playlists')
    image = models.ImageField(upload_to='playlists/')

    def __str__(self):
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField(null=True, default=None)
    genre = models.CharField(max_length=50)
    playlist = models.ManyToManyField('Playlist', related_name='songs')
    artwork = models.ImageField(upload_to='artworks/')
    song_file = models.FileField(upload_to='songs/')

    def __str__(self):
        return f"{self.name} by {self.artist}"


# class Genre(models.Model):
#     name = models.CharField(max_length=50)
#
#     def __str__(self):
#         return self.name
