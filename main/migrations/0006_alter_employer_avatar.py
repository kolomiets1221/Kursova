# Generated by Django 4.2.2 on 2023-06-10 07:02

from django.db import migrations, models
import main.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_alter_employer_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employer',
            name='avatar',
            field=models.ImageField(blank=True, default='avatars/default.jpg', null=True, upload_to=main.models.avatar_upload_path),
        ),
    ]
