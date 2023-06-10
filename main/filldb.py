import requests
import faker

faker = faker.Faker()

workers = []

def create_worker(position):
    global workers
    username = faker.name().replace(' ', '_')
    workers.append({
        'username': username,
        'password': "pass",
        'email': faker.email(),
        'name': username,
        'position': position
    })


create_worker(1)
for _ in range(2):
    create_worker(2)
for _ in range(3):
    create_worker(3)
for _ in range(4):
    create_worker(4)
for _ in range(5):
    create_worker(5)


for worker in workers:
    req = requests.get('http://127.0.0.1:8000/register?username={}&password={}&email={}&name={}&position={}'.format(
        worker['username'].replace(' ', '_'),
        worker['password'].replace(' ', '_'),
        worker['email'].replace(' ', '_'),
        worker['name'].replace(' ', '_'),
        worker['position']
    ))
    print(worker, req.status_code, req.reason)
