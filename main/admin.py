from django.contrib import admin

from .models import *


@admin.register(Shift)
class shiftAdmin(admin.ModelAdmin):
    #sort deflaut by start_time
    ordering = ('start_time',)
    list_display = ('id', 'employee', 'start_time', 'end_time', 'producted', "employ_start_time", "employ_end_time", "started", "finished")
    search_fields = ('employee', 'start_time', 'end_time', 'producted')


@admin.register(Employer)
class employeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'position')
    search_fields = ('name', 'user', 'position')

@admin.register(Token)
class tokensAdmin(admin.ModelAdmin):
    list_display = ('token', 'user')
    search_fields = ('token', 'user')

@admin.register(Start_shift_codes)
class start_shift_codesAdmin(admin.ModelAdmin):
    list_display = ('code', 'valid')
    search_fields = ('code', 'valid')
