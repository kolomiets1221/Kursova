from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User, Group
from .models import *
import random
from django.utils import timezone
import secrets

home_url = 'http://127.0.0.1:8000'


def hello_world(request):
    return JsonResponse({'hello': 'world'})


def fill_shift_table(employer, num_shifts):
    for i in range(num_shifts):
        start_time = timezone.now() + timezone.timedelta(days=i + 7)
        end_time = start_time + timezone.timedelta(hours=random.randint(7, 10))
        shift = Shift.objects.create(
            start_time=start_time,
            end_time=end_time,
            employee=employer,
        )
        shift.save()

        print(f"Shift created: {shift}")


@csrf_exempt
def register(request):
    username = request.GET.get('username')
    password = request.GET.get('password')
    email = request.GET.get('email')
    name = request.GET.get('name')
    position = request.GET.get('position')

    if username is None or password is None or email is None or name is None or position is None:
        return JsonResponse({'error': 'missing parameters'})
    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'user already exists'})

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=name.split("_")[0],
        last_name=name.split("_")[1])
    user.save()
    employee = Employer(user=user, name=name, position=position)
    employee.save()

    token = Token(user=user, token=secrets.token_hex(16))
    token.save()
    fill_shift_table(employee, random.randint(5, 25))
    return JsonResponse({'success': 'user created', 'token': token.token})


@csrf_exempt
def login(request):
    username = request.GET.get('username')
    password = request.GET.get('password')

    if username is None or password is None:
        return JsonResponse({'error': 'missing parameters'})

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'error': 'invalid credentials'})

    token = Token(user=user, token=secrets.token_hex(16))
    token.save()
    return JsonResponse({'success': 'login successful', 'token': token.token})


def get_shifts(request):
    name = request.GET.get('name')
    if name is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Employer.objects.filter(name=name).exists():
        return JsonResponse({'error': 'invalid name'})
    employee = Employer.objects.get(name=name)

    shifts = Shift.objects.filter(employee=employee)
    return JsonResponse({'shifts': [{
        'start_time': shift.start_time,
        'end_time': shift.end_time,
        "producted": shift.producted,
        "employ_start_time": shift.employ_start_time,
        "employ_end_time": shift.employ_end_time,
        "finished": shift.finished
    } for shift in shifts]})


def avatars(request):
    name = request.GET.get('name')
    if name is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Employer.objects.filter(name=name).exists():
        return JsonResponse({'error': 'invalid name'})
    employee = Employer.objects.get(name=name)
    return HttpResponse(employee.avatar, content_type="image/png")


def get_employers(request):
    token = request.GET.get('token')
    if token is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    employers = Employer.objects.all()
    return JsonResponse({'employers': [{
        'name': employer.name,
        'img_url': f"{home_url}/avatar?name={employer.name}",
        'position': employer.get_position_display(),
    } for employer in employers]})


def get_all_shifts(request):
    token = request.GET.get('token')
    if token is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    shifts = Shift.objects.all()
    return JsonResponse({'shifts': [{
        "id": shift.id,
        'start_time': shift.start_time,
        'end_time': shift.end_time,
        "producted": shift.producted,
        "worktime": f"{shift.work_time()}",
        "employ_start_time": shift.employ_start_time,
        "employ_end_time": shift.employ_end_time,
        "finished": shift.finished
    } for shift in shifts]})


def get_code(request):
    codes = Start_shift_codes.objects.all()
    if len(codes) > 1:
        for code in codes:
            code.delete()
        code = Start_shift_codes(
            code=secrets.token_hex(5).upper(),
            valid=timezone.now() + timezone.timedelta(minutes=5))
        code.save()
    elif len(codes) == 0:
        code = Start_shift_codes(
            code=secrets.token_hex(5).upper(),
            valid=timezone.now() + timezone.timedelta(minutes=5))
        code.save()

    valid_code = Start_shift_codes.objects.all()[0]
    if valid_code.valid < timezone.now():
        valid_code.delete()
        code = Start_shift_codes(
            code=secrets.token_hex(5).upper(),
            valid=timezone.now() + timezone.timedelta(minutes=5))
        code.save()
        valid_code = Start_shift_codes.objects.all()[0]
    return JsonResponse({
        'code': valid_code.code,
        "time_left": int((valid_code.valid - timezone.now()).total_seconds())
    })


def start_shift(request):
    token = request.GET.get('token')
    code = request.GET.get('code')
    id = request.GET.get('id')
    if token is None or code is None or id is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    if not Start_shift_codes.objects.filter(code=code).exists():
        return JsonResponse({'error': 'invalid code'})
    if not Shift.objects.filter(id=id).exists():
        return JsonResponse({'error': 'invalid id'})
    emoloer = Employer.objects.get(user=Token.objects.get(token=token).user)
    if Shift.objects.filter(employee=emoloer, started=True, finished=False).exists():
        return JsonResponse({'error': 'you already have a shift'})
    if not Shift.objects.filter(id=id, employee=emoloer).exists():
        return JsonResponse({'error': 'invalid id'})
    shift = Shift.objects.get(id=id, employee=emoloer)
    if shift.started:
        return JsonResponse({'error': 'shift already started'})
    shift.employ_start_time = timezone.now()
    shift.started = True
    shift.save()
    return JsonResponse({'success': 'shift started'})


def end_shift(request):
    token = request.GET.get('token')
    producted = request.GET.get('producted')
    id = request.GET.get('id')
    if token is None or producted is None or id is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    employee = Employer.objects.get(user=Token.objects.get(token=token).user)
    if not Shift.objects.filter(id=id, employee=employee, started=True, finished=False).exists():
        return JsonResponse({'error': 'invalid id or shift already finished'})
    shift = Shift.objects.get(id=id, employee=employee, started=True, finished=False)
    shift.employ_end_time = timezone.now()
    shift.producted = int(producted)
    shift.finished = True
    shift.save()
    return JsonResponse({'success': 'shift ended'})


def get_active_shifts(request):
    token = request.GET.get('token')
    if token is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    emploer = Employer.objects.get(user=Token.objects.get(token=token).user)
    shifts = Shift.objects.filter(employee=emploer, started=True, finished=False)
    return JsonResponse({'shifts': [{
        "id": shift.id,
        'start_time': shift.start_time,
        'end_time': shift.end_time,
        "producted": shift.producted,
        "employ_start_time": shift.employ_start_time,
        "employ_end_time": shift.employ_end_time,
        "finished": shift.finished
    } for shift in shifts]})

def get_my_shifts(request):
    token = request.GET.get('token')
    if token is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    emploer = Employer.objects.get(user=Token.objects.get(token=token).user)
    shifts = Shift.objects.filter(employee=emploer)
    return JsonResponse({'shifts': [{
        "id": shift.id,
        'start_time': shift.start_time,
        'end_time': shift.end_time,
        "producted": shift.producted,
        "employ_start_time": shift.employ_start_time,
        "employ_end_time": shift.employ_end_time,
        "finished": shift.finished
            } for shift in shifts]})


def user_info(request):
    token = request.GET.get('token')
    if token is None:
        return JsonResponse({'error': 'missing parameters'})
    if not Token.objects.filter(token=token).exists():
        return JsonResponse({'error': 'invalid token'})
    emploer = Employer.objects.get(user=Token.objects.get(token=token).user)
    coef = Coefs.objects.get(position=emploer.get_position_display())
    return JsonResponse({
        "name": emploer.name,
        "img_url": f"{home_url}/avatar?name={emploer.name}",
        "position": emploer.get_position_display(),
        "total_shifts": len(Shift.objects.filter(employee=emploer)),
        "average_worktime": f"{emploer.employ_average_work_time()}",
        "total_producted": emploer.total_producted(),
        "worked_last_mouth": f"{emploer.worked_hours_last_month()}",
        "shift_in_next_mouth": f"{emploer.shifts_for_month()}",
        "expected_salary": f"{float(emploer.total_work_hours())*coef.coef*2006}"
    })
