from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.templatetags.static import static
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
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
        end_time = start_time + timezone.timedelta(hours=random.randint(4, 8))
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
    fill_shift_table(employee, 10)
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
    user = Token.objects.get(token=token).user
    employer = Employer.objects.get(user=user)
    employers = Employer.objects.filter(position=employer.position)
    # get all emploers with higher  or equal position
    employers = employers.filter(position__gte=employer.position)
    return JsonResponse({'employers': [{
        'name': employer.name,
        'img_url': f"{home_url}/avatar?name={employer.name}",
        'position': employer.get_position_display(),
    } for employer in employers]})
