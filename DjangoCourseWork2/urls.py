"""
URL configuration for DjangoCourseWork2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
import main.views as views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register', views.register, name='register'),
    path('login', views.login_api, name='login'),
    path('get_employers', views.get_employers, name='get_employers'),
    path('get_code', views.get_code, name='get_code'),
    path("start_shift", views.start_shift, name="start_shift"),
    path("end_shift", views.end_shift, name="end_shift"),
    path("user_info", views.user_info, name="user_info"),
    path("ds_rq", views.displayrequest, name="displayrequest"),
    path("test", views.test, name="get_my_requests"),
    path("upload_avatar", views.upload_image, name="upload_avatar"),
    path("get_employee", views.get_emploeyer_info, name="get_employee"),
    path("get_user_info", views.get_user_info, name="get_user_info"),
    path("logout", views.log_out, name="logout"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

