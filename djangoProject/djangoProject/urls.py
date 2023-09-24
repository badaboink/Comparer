from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from comparer import views

router = routers.DefaultRouter()
router.register(r'category', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
