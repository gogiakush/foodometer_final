from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("info", views.info, name="info"),
    path("addfood", views.addfood, name="addfood"),
    path("foods", views.foods, name="foods"),
    path("startnew", views.start_new, name="startnew")
]
