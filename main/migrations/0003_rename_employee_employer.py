# Generated by Django 4.2.2 on 2023-06-09 20:31

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0002_shift_employ_end_time_shift_employ_start_time_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='employee',
            new_name='Employer',
        ),
    ]
