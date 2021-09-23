import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import time

from .models import User, Food

def index(request):
    # Check to see if user is logged in
    if request.user.is_authenticated:
        return render(request, "foodom/index.html", {
            "meals": request.user.meals.all()
        })

    # Users who are not logged in are prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return render(request, "foodom/index.html", {
                "meals": request.user.meals.all()
            })
        else:
            return render(request, "foodom/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "foodom/login.html")

#Logs out user
def logout_view(request):
    logout(request)
    return render(request, "foodom/login.html")

#Registers user
def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "foodom/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "foodom/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "foodom/register.html")

@csrf_exempt
#Adds new login info about a logged in user; specifically full name and calorie limit
def info(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        
        #get all the values
        request.user.fname = data["fname"]
        request.user.lname = data["lname"]
        request.user.cal_limit = data["cal_limit"]

        #Save it in the current user's profile
        request.user.save()

        return HttpResponse(status=204)

    elif request.method == "GET":
        return JsonResponse(request.user.serialize())

@csrf_exempt
@login_required(login_url='/login')
#Creates a food item and stores it in current user's list of meals
def addfood(request):
    if request.method == "POST":
        data = json.loads(request.body)

        #Stores the food's name, category, and calories
        name = data.get("name", "")
        category = data.get("category", "")
        calories = data.get("calories", 0)

        #Saves the food into the database
        food = Food(
            name=name.capitalize(),
            category=category,
            calories=calories
        )
        food.save()
        
        request.user.meals.add(food)
        request.user.save()
        return JsonResponse({"message": "Food added successfully"}, status=201)
    else:
        return render(request, "foodom/addfood.html")

#Returns all of the information stored in each food's variables
def foods(request):
    if request.method == "GET":
        return JsonResponse([food.serialize() for food in request.user.meals.all()], safe=False)

#Clears all meals from user's meal list
def start_new(request):
    request.user.meals.clear()

    return HttpResponse(status=204)



    
