import pandas as pd
from faker import Faker
import random
import os

fake = Faker()

def get_gender() -> str:
    return 'Male' if random.random() <= 0.5 else 'Female'

def get_study_degree() -> str:
    return 'Bachelor' if random.random() <= 0.7 else 'Master'

def get_study_program() -> str:
    return 'Computer Science' if random.random() <= 0.5 else 'Information Systems'

def get_skill_level() -> str:
    value = random.random()
    if value <= 0.15:
        return 'Novice'
    elif value <= 0.75:
        return 'Intermediate'
    elif value <= 0.90:
        return 'Advanced'
    else:
        return 'Expert'

def get_language_level() -> str:
    value = random.random()
    if value <= 0.05:
        return 'A1/A2'
    elif value <= 0.2:
        return 'B1/B2'
    elif value <= 0.6:
        return 'C1/C2'
    else:
        return 'Native'

def get_country() -> str:
    value = random.random()
    if value <= 0.4:
        return 'DE'
    else:
        return fake.country_code()

def get_project_preference(length) -> [str]:
    priorities = list(range(length))
    random.shuffle(priorities)
    return priorities

data = []

for index in range(1, 61):
    row = {}
    row['firstName'] = fake.first_name()
    row['lastName'] = fake.last_name()
    row['email'] = row['firstName'].lower() +  "." + row['lastName'].lower() +  '@example.com'
    row['gender'] = get_gender()
    row['id'] = f"id_{index}"
    row['semester'] = fake.random_int(1, 6)
    row['studyDegree'] = get_study_degree()
    row['studyProgram'] = get_study_program()
    row['skillLevel'] = get_skill_level()
    row['language[de]'] = get_language_level()
    row['language[en]'] = get_language_level()
    row['nationality'] = get_country()

    projects = [
        'iHaus',
        'ALLZ',
        'MED',
        'IMT',
        'BSH',
        'BMW',
        'QUAR',
        'TSYS',
        'McKIN',
        'LMU',
    ]

    priorities = get_project_preference(len(projects))

    for project in projects:
        row[f'projectPreference[{project}]'] = priorities.pop()

    skills = [
        'Machine Learning',
        'Server-side development',
        'Web Development',
        'Cloud infrastructure',
        'Docker, Kubernetes',
        'Games Engineering',
        'UI/UX',
    ]

    for skill in skills:
        row[f'skill[{skill}]'] = get_skill_level()

    devices = [
        'IPhone',
        'Mac',
        'IPad',
        'Watch',
    ]

    for device in devices:
        row[f'device[{device}]'] = str(random.random() <= 0.4).lower()


    data.append(row)

out_df = pd.DataFrame(data)

out_df.to_csv('output.csv', index=False)


