from rest_framework import serializers
from .models import Category, Playlist, Song


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
    class Meta:
        model = Playlist
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


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
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
