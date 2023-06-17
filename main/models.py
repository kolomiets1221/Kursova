import os

from django.db import models
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.dispatch import receiver


class Shift(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    employee = models.ForeignKey('employer', on_delete=models.CASCADE)
    producted = models.IntegerField(null=True)
    employ_start_time = models.DateTimeField(null=True)
    employ_end_time = models.DateTimeField(null=True)
    started = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)

    def work_time(self):
        if self.end_time is None:
            return "Ще не закінчено"
        if self.employ_end_time is None:
            return "Ще не почато"
        return str(round((self.employ_end_time - self.employ_start_time).total_seconds() / 3600, 2)) + " годин"

    def ShiftTime(self):
        return str((self.end_time - self.start_time).total_seconds() / 3600) + " годин"

    def __str__(self):
        return str(self.employee) + " " + str(self.start_time) + " " + str(self.end_time)


def avatar_upload_path(instance, filename):
    return f"avatars/{instance.name}_{filename.replace(' ', '_')}"


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

    avatar = models.ImageField(upload_to=avatar_upload_path, null=True, blank=True,
                               default='avatars/default.jpg')

    def employ_average_work_time(self):
        shifts = Shift.objects.filter(employee=self)
        total = 0
        for shift in shifts:
            if shift.employ_start_time is None or shift.employ_end_time is None:
                continue
            total += round((shift.employ_end_time - shift.employ_start_time).total_seconds() / 3600, 2)
        return str(round(total / len(shifts), 2))

    def total_producted(self):
        shifts = Shift.objects.filter(employee=self)
        total = 0
        for shift in shifts:
            if shift.producted is None:
                continue
            total += shift.producted
        return total

    def worked_hours_last_month(self):
        shifts = Shift.objects.filter(employee=self, start_time__month=timezone.now().month)
        total = 0
        for shift in shifts:
            if shift.employ_start_time is None or shift.employ_end_time is None:
                continue
            total += round((shift.employ_end_time - shift.employ_start_time).total_seconds() / 3600, 2)
        return str(total)

    def total_work_hours(self):
        shifts = Shift.objects.filter(employee=self)
        total = 0
        for shift in shifts:
            if shift.end_time is None:
                continue
            total += float(shift.ShiftTime().split(' ')[0])
        return str(total)
    def shifts_for_month(self):
        shifts = Shift.objects.filter(employee=self, start_time__month=timezone.now().month)
        return len(shifts)

    def __str__(self):
        return str(self.name) + " " + str(self.position)




class Start_shift_codes(models.Model):
    code = models.CharField(max_length=100)
    valid = models.DateTimeField()

    def __str__(self):
        return str(self.code) + " " + str(self.valid)


class Coefs(models.Model):
    coef = models.FloatField()
    position = models.CharField(max_length=100)

    def __str__(self):
        return str(self.coef) + " " + str(self.position)

    @receiver(post_migrate)
    def create_coefs(sender, **kwargs):
        if sender.name == 'main':
            Coefs.objects.create(coef=3, position='Головний інженер')
            Coefs.objects.create(coef=2, position='Інженер')
            Coefs.objects.create(coef=1.5, position='Майстер')
            Coefs.objects.create(coef=1, position='Робітник')
            Coefs.objects.create(coef=0.6, position='Стажер')
