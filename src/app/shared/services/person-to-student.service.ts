import { Injectable } from '@angular/core';
import { Gender as PersonGender, Person } from '../models/person';
import {
  SkillProficiency,
  Student,
  StudentSkill,
  Skill,
  Device as StudentDevice,
  Language,
  LanguageProficiency,
  ProjectPreference,
  Gender as StudentGender,
} from 'src/app/api/models';
import { Skill as PersonSkill, SkillLevel } from '../models/skill';
import { Device as PersonDevice } from '../models/device';

@Injectable({
  providedIn: 'root',
})
// TODO: Delete after removing person and team code
export class PersonToStudentService {
  constructor() {}

  transformPersonsToStudents(persons: Person[]): Student[] {
    return persons.map(person => this.transformPersonToStudent(person));
  }

  private transformPersonToStudent(person: Person): Student {
    return {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      id: person.tumId,
      nationality: person.nationality,
      gender: person.gender == PersonGender.Male ? StudentGender.Male : StudentGender.Female,
      introCourseProficiency: this.personSkillLevelToStudentSkillLevel(person.supervisorRating),
      introSelfAssessment: this.personIosDevToStudentSkillLevel(person.iosDev),
      devices: this.personDevicesToStudentDevices(person.devices),
      languages: this.personLanguagesToStudentLanguages(person),
      skills: this.personSkillsToStudentSkills(person.skills),
      projectPreferences: this.teamPrioritiesToProjectPreferences(person.teamPriorities),
      semester: person.semester,
      studyDegree: person.major,
      studyProgram: person.major,
      tutorComments: [{ date: null, text: person.tutorComments, author: 'Tutor', description: null }],
      studentComments: [{ date: null, text: person.studentComments, author: 'Student', description: null }],
    };
  }

  private teamPrioritiesToProjectPreferences(teamPriorities: string[]): ProjectPreference[] {
    return teamPriorities.map((teamPriority, index) => {
      return { priority: index, projectId: teamPriority };
    });
  }

  private personLanguagesToStudentLanguages(person: Person): Language[] {
    return [
      this.personLanguageToStudentLanguage('de', person.germanLanguageLevel),
      this.personLanguageToStudentLanguage('en', person.englishLanguageLevel),
    ];
  }

  private personLanguageToStudentLanguage(language: string, proficiency: string): Language {
    return { language: language, proficiency: this.personLangaugeToStudentLanguageProficiency(proficiency) };
  }

  private personLangaugeToStudentLanguageProficiency(proficiency: string): LanguageProficiency {
    switch (proficiency) {
      case 'B1/B2':
        return LanguageProficiency.B1B2;
      case 'C1/C2':
        return LanguageProficiency.C1C2;
      case 'Native':
        return LanguageProficiency.Native;
      default:
        return LanguageProficiency.A1A2;
    }
  }
  private personDevicesToStudentDevices(devices: PersonDevice[]): StudentDevice[] {
    return devices.map(device => this.personDeviceToStudentDevice(device)).filter(device => device !== null);
  }

  private personDeviceToStudentDevice(device: PersonDevice): StudentDevice {
    switch (device) {
      case PersonDevice.Iphone:
        return StudentDevice.IPhone;
      case PersonDevice.Ipad:
        return StudentDevice.IPad;
      case PersonDevice.Mac:
        return StudentDevice.Mac;
      case PersonDevice.Watch:
        return StudentDevice.Watch;
      default:
        return null;
    }
  }

  private personSkillsToStudentSkills(skills: PersonSkill[]): StudentSkill[] {
    return skills.map(skill => this.personSkillToStudentSkill(skill));
  }

  private personSkillToStudentSkill(skill: PersonSkill): StudentSkill {
    return {
      id: skill.name,
      proficiency: this.personSkillLevelToStudentSkillLevel(skill.skillLevel),
    };
  }

  private personSkillLevelToStudentSkillLevel(skillLevel: SkillLevel): SkillProficiency {
    switch (skillLevel) {
      case 2:
        return SkillProficiency.Intermediate;
      case 3:
        return SkillProficiency.Advanced;
      case 4:
        return SkillProficiency.Expert;
      default:
        return SkillProficiency.Novice;
    }
  }

  private personIosDevToStudentSkillLevel(iosDev: string): SkillProficiency {
    switch (iosDev) {
      case 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).':
        return SkillProficiency.Intermediate;
      case 'I have been an active developer for a native Apple application.':
        return SkillProficiency.Advanced;
      case 'I have submitted my own native Apple application(s) to the AppStore.':
        return SkillProficiency.Expert;
      default:
        return SkillProficiency.Novice;
    }
  }

  transformPersonsToSkills(persons: Person[]): Skill[] {
    if (!persons || persons.length < 1) {
      return [];
    }
    const firstPerson = persons[0];

    if (!firstPerson || !firstPerson.skills || firstPerson.skills.length < 1) {
      return [];
    }
    const skills = firstPerson.skills.map(skill => ({ title: skill.name, description: skill.name, id: skill.name }));

    return skills;
  }
}
