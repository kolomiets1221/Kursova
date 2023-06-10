import os

from django.db import models
from django.utils import timezone


class Shift(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    employee = models.ForeignKey('employer', on_delete=models.CASCADE)
    producted = models.IntegerField(null=True)
    employ_start_time = models.DateTimeField(null=True)
    employ_end_time = models.DateTimeField(null=True)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return str(self.employee) + " " + str(self.start_time) + " " + str(self.end_time)


def avatar_upload_path(instance, filename):
    return f"static/avatars/{instance.name}_{filename.replace(' ', '_')}"


class Employer(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    positions = (
        ('1', 'Головний інженер'),
        ('2', 'Інженер'),
        ('3', 'Майстер'),
        ('4', 'Робітник'),
        ('5', 'Стажер'),
    )
    position = models.CharField(max_length=100, choices=positions)

    avatar = models.ImageField(upload_to=avatar_upload_path, null=True, blank=True, default='static/avatars/default.jpg')

    def __str__(self):
        return str(self.name) + " " + str(self.position)


class Token(models.Model):
    token = models.CharField(max_length=100)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.token) + " " + str(self.user)
