from django.contrib import admin

from .models import *


@admin.register(Shift)
class shiftAdmin(admin.ModelAdmin):
    #sort deflaut by start_time
    ordering = ('start_time',)
    list_display = ('employee', 'start_time', 'end_time', 'producted')
    search_fields = ('employee', 'start_time', 'end_time', 'producted')


@admin.register(Employer)
class employeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'position')
    search_fields = ('name', 'user', 'position')

@admin.register(Token)
class tokensAdmin(admin.ModelAdmin):
    list_display = ('token', 'user')
    search_fields = ('token', 'user')
