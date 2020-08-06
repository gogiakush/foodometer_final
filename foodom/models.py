from django.contrib.auth.models import AbstractUser
from django.db.models.query import EmptyQuerySet
from django.db import models

#User model
class User(AbstractUser):
    fname = models.CharField(max_length=30, default="")
    lname = models.CharField(max_length=150, default="")
    cal_limit = models.IntegerField(default=2000)
    meals = models.ManyToManyField("Food", default=EmptyQuerySet, related_name="Eater")

    def serialize(self):
        return {
            "id": self.id,
            "fname": self.fname,
            "lname": self.lname,
            "cal_limit": self.cal_limit
        }

#Food model
class Food(models.Model):
    name = models.TextField()
    calories = models.IntegerField()
    category = models.CharField(max_length=20) 

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "calories": self.calories,
            "category": self.category
        }

    def __str__(self):
        return self.name
