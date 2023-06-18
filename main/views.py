import random
import secrets

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.templatetags.static import static
from django.views.decorators.csrf import csrf_exempt

from .models import *

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


def register(request):
    username = request.GET.get('username')
    password = request.GET.get('password')
    email = request.GET.get('email')
    name = request.GET.get('name')
    position = request.GET.get('position')
    if len(name.split(" ")) != 2:
        return JsonResponse({'message': 'invalid name'}, status=400)

    if username is None or password is None or email is None or name is None or position is None:
        return JsonResponse({'message': 'missing parameters'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'message': 'user already exists'}, status=409)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=name.split(" ")[0],
        last_name=name.split(" ")[1])
    user.save()

    employee = Employer(user=user, name=name, position=position)
    employee.save()

    fill_shift_table(employee, random.randint(5, 25))
    login(request, user)

    return JsonResponse({'message': 'user created'}, status=201)


@csrf_exempt
def login_api(request):
    username = request.GET.get('username')
    password = request.GET.get('password')
    remember_me = request.GET.get('remember_me')

    print(request.GET)

    if username is None or password is None:
        return JsonResponse({'message': 'missing parameters'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'message': 'invalid credentials'}, status=401)
    login(request, user)

    if not remember_me == 'true':
        request.session.set_expiry(0)

    return JsonResponse({'message': 'login successful'}, status=200)


@csrf_exempt
def displayrequest(request):
    referring_url = request.META.get('HTTP_REFERER')
    print(request.GET)
    res = redirect(referring_url)
    # set cookie
    res.set_cookie('name', 'value')
    return res


def get_employers(request):
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'})
    employers = Employer.objects.all()
    return JsonResponse({'employers': [{
        "id": employer.id,
        'name': employer.name,
        'avatar': f"{home_url + employer.avatar.url}",
        'position': employer.get_position_display(),
        "email": employer.user.email,
    } for employer in employers]})


def test(request):
    return JsonResponse({'message': static("default.png")})


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
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'user is not authenticated'})
    user = User.objects.get(username=request.user)
    code = request.GET.get('code')
    id = request.GET.get('id')
    if code is None or id is None:
        return JsonResponse({'error': 'missing parameters'}, status=404)
    if not Employer.objects.filter(user=user).exists():
        return JsonResponse({'error': 'invalid user'}, status=404)
    employee = Employer.objects.get(user=user)
    if Shift.objects.filter(employee=employee, started=True, finished=False).exists():
        return JsonResponse({'error': 'You have already started shifts'}, status=403)
    if not Shift.objects.filter(id=int(id)).exists():
        return JsonResponse({'error': 'shift not found'}, status=404)
    if not Start_shift_codes.objects.filter(code=code).exists():
        return JsonResponse({'error': 'invalid code'}, status=404)
    shift = Shift.objects.get(id=int(id))
    shift.started = True
    shift.employ_start_time = timezone.now()
    shift.save()
    Start_shift_codes.objects.get(code=code).delete()
    Start_shift_codes.objects.all().delete()
    return JsonResponse({'success': 'shift started'})


def end_shift(request):
    producted = request.GET.get('producted')
    id = request.GET.get('id')
    if producted is None or id is None:
        return JsonResponse({'error': 'missing parameters'}, status=404)
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'user is not authenticated'})
    user = User.objects.get(username=request.user)
    if not Employer.objects.filter(user=user).exists():
        return JsonResponse({'error': 'invalid user'}, status=404)
    if not Shift.objects.filter(id=int(id)).exists():
        return JsonResponse({'error': 'shift not found'}, status=404)
    shift = Shift.objects.get(id=int(id))
    shift.finished = True
    shift.employ_end_time = timezone.now()
    shift.producted = int(producted)
    shift.save()
    return JsonResponse({'success': 'shift ended'}, status=200)


def mouth_format(mouth):
    if len(str(mouth)) < 2:
        return f"0{mouth}"
    return mouth


def date_formater(date):
    if date is None:
        return "No data"
    return f"{mouth_format(date.month)}.{mouth_format(date.day)} {mouth_format(date.hour)}:{mouth_format(date.minute)}"


def user_info(request):
    user = User.objects.get(username=request.user)
    if not user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'})
    emploer = Employer.objects.get(user=user)
    coef = Coefs.objects.get(position=emploer.get_position_display())
    shifts = Shift.objects.filter(employee=emploer)
    return JsonResponse({
        "name": emploer.name,
        "avatar": f"{home_url + emploer.avatar.url}",
        "position": emploer.get_position_display(),
        "total_shifts": len(Shift.objects.filter(employee=emploer)),
        "average_worktime": f"{emploer.employ_average_work_time()}",
        "total_producted": emploer.total_producted(),
        "worked_last_mouth": f"{emploer.worked_hours_last_month()}",
        "shift_in_next_mouth": f"{emploer.shifts_for_month()}",
        "expected_salary": f"{round(float(emploer.total_work_hours()) * coef.coef * 120 / 1000, 0) * 1000}",
        "shifts": [{
            "id": shift.id,
            "start_time": date_formater(shift.start_time),
            "end_time": date_formater(shift.end_time),
            "producted": shift.producted if shift.producted is not None else 0,
            "employ_start_time": date_formater(shift.employ_start_time),
            "employ_end_time": date_formater(shift.employ_end_time),
            "shift_work_time": f"{shift.ShiftTime()}",
            "is_active": shift.started and not shift.finished,
            "finished": shift.finished
        } for shift in shifts]
    })


@csrf_exempt
def upload_image(request):
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'})

    if request.method == 'POST':
        image = request.FILES['image']
        user = User.objects.get(username=request.user)
        emploer = Employer.objects.get(user=user)
        emploer.avatar = image
        emploer.save()
        return JsonResponse({'message': 'image uploaded'}, status=201)
    else:
        return JsonResponse({'message': 'image not uploaded'})


def get_emploeyer_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'})
    id = request.GET.get('id')
    if id is None:
        return JsonResponse({'error': 'missing parameters'}, status=404)
    if not Employer.objects.filter(id=id).exists():
        return JsonResponse({'error': 'invalid id'}, status=404)
    emploer = Employer.objects.get(id=id)
    coef = Coefs.objects.get(position=emploer.get_position_display())
    shifts = Shift.objects.filter(employee=emploer)
    return JsonResponse({
        "name": emploer.name,
        "avatar": f"{home_url + emploer.avatar.url}",
        "position": emploer.get_position_display(),
        "total_shifts": len(Shift.objects.filter(employee=emploer)),
        "average_worktime": f"{emploer.employ_average_work_time()}",
        "total_producted": emploer.total_producted(),
        "worked_last_mouth": f"{emploer.worked_hours_last_month()}",
        "shift_in_next_mouth": f"{emploer.shifts_for_month()}",
        "expected_salary": f"{round(float(emploer.total_work_hours()) * coef.coef * 120 / 1000, 0) * 1000}",
        "shifts": [{
            "id": shift.id,
            "start_time": date_formater(shift.start_time),
            "end_time": date_formater(shift.end_time),
            "producted": shift.producted if shift.producted is not None else 0,
            "employ_start_time": date_formater(shift.employ_start_time),
            "employ_end_time": date_formater(shift.employ_end_time),
            "shift_work_time": f"{shift.ShiftTime()}",
            "is_active": shift.started and not shift.finished,
            "finished": shift.finished
        } for shift in shifts]
    })

def get_user_info(request):
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'}, status=404)
    user = User.objects.get(username=request.user)
    if not Employer.objects.filter(user=user).exists():
        return JsonResponse({'error': 'invalid user'}, status=404)
    emploer = Employer.objects.get(user=user)
    return JsonResponse({
        "name": user.username,
        "avatar": f"{home_url + emploer.avatar.url}",
        "position": emploer.get_position_display(),
        }, status=200)

def log_out(request):
    logout(request)
    return JsonResponse({'message': 'logged out'}, status=200)
