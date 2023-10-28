from rest_framework import serializers
from .models import Category, Playlist, Song
from django.contrib.auth.models import User, Group


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

    def validate(self, data):
        serializer_fields = set(self.fields.keys())
        incoming_fields = set(data.keys())

        unexpected_fields = incoming_fields - serializer_fields

        if unexpected_fields:
            raise serializers.ValidationError(
                f"Unexpected field(s) found: {', '.join(unexpected_fields)}"
            )

        return data


class PlaylistSerializer(serializers.ModelSerializer):
    playlist_owner = serializers.ReadOnlyField()

    class Meta:
        model = Playlist
        fields = '__all__'

    def to_representation(self, instance):
        representation = super(PlaylistSerializer, self).to_representation(instance)
        playlist_owner = instance.playlist_owner
        representation['playlist_owner'] = {
            'id': playlist_owner.id,
            'username': playlist_owner.username,
        }
        return representation

    def create(self, validated_data):
        validated_data['playlist_owner'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        serializer_fields = set(self.fields.keys())
        incoming_fields = set(data.keys())

        unexpected_fields = incoming_fields - serializer_fields

        if unexpected_fields:
            raise serializers.ValidationError(
                f"Unexpected field(s) found: {', '.join(unexpected_fields)}"
            )

        return data


class SongSerializer(serializers.ModelSerializer):
    song_owner = serializers.ReadOnlyField()

    class Meta:
        model = Song
        fields = '__all__'

    def create(self, validated_data):
        validated_data['song_owner'] = self.context['request'].user
        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super(SongSerializer, self).to_representation(instance)
        song_owner = instance.song_owner
        representation['song_owner'] = {
            'id': song_owner.id,
            'username': song_owner.username,
        }
        return representation

    def validate(self, data):
        serializer_fields = set(self.fields.keys())
        incoming_fields = set(data.keys())

        unexpected_fields = incoming_fields - serializer_fields

        if unexpected_fields:
            raise serializers.ValidationError(
                f"Unexpected field(s) found: {', '.join(unexpected_fields)}"
            )

        return data


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ("name", )

