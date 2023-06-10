from django.contrib import admin

from .models import *


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    ordering = ('start_time',)
    list_display = ('id', 'employee', 'start_time', 'end_time', 'producted', 'employ_start_time', 'employ_end_time', 'started', 'finished', 'ShiftTime', 'work_time')
    search_fields = ('employee__name', 'start_time', 'end_time')



    Shift._meta.get_field('employee').verbose_name = 'Працівник'
    Shift._meta.get_field('start_time').verbose_name = 'Час початку зміни'
    Shift._meta.get_field('end_time').verbose_name = 'Час закінчення зміни'
    Shift._meta.get_field('producted').verbose_name = 'Вироблено'
    Shift._meta.get_field('employ_start_time').verbose_name = 'Час початку роботи'
    Shift._meta.get_field('employ_end_time').verbose_name = 'Час закінчення роботи'
    Shift._meta.get_field('started').verbose_name = 'Почато'
    Shift._meta.get_field('finished').verbose_name = 'Закінчено'
    Shift.work_time.short_description = 'Час роботи(годин)'
    Shift.ShiftTime.short_description = 'Тривалість зміни(годин)'


@admin.register(Employer)
class employeeAdmin(admin.ModelAdmin):
    list_display = ('name',
                    'user',
                    'position',
                    'total_producted',
                    'worked_hours_last_month',
                    'shifts_for_month',
                    'employ_average_work_time',
                    'total_work_hours'
                    )
    search_fields = ('name', 'user', 'position')

    Employer._meta.get_field('user').verbose_name = 'Користувач'
    Employer._meta.get_field('name').verbose_name = 'Ім\'я'
    Employer._meta.get_field('position').verbose_name = 'Посада'
    Employer.total_producted.short_description = 'Вироблено'
    Employer.worked_hours_last_month.short_description = 'Відпрацьовано за місяць(годин)'
    Employer.shifts_for_month.short_description = 'Змін за місяць'
    Employer.employ_average_work_time.short_description = 'Середній час роботи(годин)'
    Employer.total_work_hours.short_description = 'Всього робочих годин'



@admin.register(Token)
class tokensAdmin(admin.ModelAdmin):
    list_display = ('token', 'user')
    search_fields = ('token', 'user')

    Token._meta.get_field('token').verbose_name = 'Токен'
    Token._meta.get_field('user').verbose_name = 'Користувач'

@admin.register(Start_shift_codes)
class start_shift_codesAdmin(admin.ModelAdmin):
    list_display = ('code', 'valid')
    search_fields = ('code', 'valid')

    Start_shift_codes._meta.get_field('code').verbose_name = 'Код'
    Start_shift_codes._meta.get_field('valid').verbose_name = 'Дійсний до'

@admin.register(Coefs)
class coefsAdmin(admin.ModelAdmin):
    list_display = ('position', 'coef')
    search_fields = ('position', 'coef')

    Coefs._meta.get_field('position').verbose_name = 'Назва'
    Coefs._meta.get_field('coef').verbose_name = 'Коефіцієнт'
