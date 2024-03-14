import { Injectable } from '@angular/core';
import { Allocation, LanguageProficiency, Project, Student } from 'src/app/api/models';
import { Person } from '../models/person';
import { Gender as GenderPerson } from '../models/person';
import { Gender as GenderStudent } from 'src/app/api/models';
import { SkillProficiency } from 'src/app/api/models';
import { SkillLevel } from '../models/skill';
import { StudentSkill as SkillStudent } from 'src/app/api/models';
import { Skill as SkillPerson } from '../models/skill';
import { Device as DevicePerson } from '../models/device';
import { Device as DeviceStudent } from 'src/app/api/models';
import { Skill as SkillPrompt } from 'src/app/api/models';
import { IconMapperService } from '../ui/icon-mapper.service';

@Injectable({
  providedIn: 'root',
})
// TODO: Delete after removing person and team code
export class StudentToPersonService {
  private skillsPrompt: SkillPrompt[] = [];
  private projectsPrompt: Project[] = [];
  private allocationsPrompt: Allocation[] = [];

  constructor() {}

  public transformStudentsToPersons(
    students: Student[],
    skillsPrompt: SkillPrompt[],
    projectsPrompt: Project[],
    allocationsPrompt: Allocation[]
  ): Person[] {
    this.skillsPrompt = skillsPrompt;
    this.projectsPrompt = projectsPrompt;
    this.allocationsPrompt = allocationsPrompt;
    return students.map(s => this.transformStudentToPerson(s));
  }

  public transformStudentToPerson(student: Student): Person {
    const person = new Person();

    person.firstName = student.firstName;
    person.lastName = student.lastName;
    person.email = student.email;
    person.tumId = student.id;
    person.nationality = student.nationality;
    person.gender = this.getGender(student.gender);
    person.gravatarUrl = IconMapperService.getGravatarIcon(student.email);

    //LanguageProficiency
    person.germanLanguageLevel = this.getLanguageProficiency(student, 'de') || LanguageProficiency.A1A2;
    person.englishLanguageLevel = this.getLanguageProficiency(student, 'en') || LanguageProficiency.A1A2;

    //Skills
    person.skills = this.getSkills(student.skills);
    person.supervisorRating = this.getSkillLevel(student.introCourseProficiency) || SkillLevel.None;
    person.iosDev =
      this.getIOSDev(student.introSelfAssessment) ||
      'I have no experience in Apple platform development other than the intro course.';

    //University
    person.semester = student.semester;
    person.major = student.studyDegree + ' ' + student.studyProgram;

    //Comments
    if (student.tutorComments) person.tutorComments = student.tutorComments.map(comment => comment.text).join('\n');

    if (student.studentComments)
      person.studentComments = student.studentComments.map(comment => comment.text).join('\n');

    //Priorities
    person.teamPriorities = student.projectPreferences.sort(p => p.priority).map(p => this.getProjectName(p.projectId));
    person.teamName = this.getTeamName(student.id);

    //Devices
    person.devices = student.devices.map(this.getDevice).filter(d => d !== null);

    //Other
    person.iOSDevExplained = 'iOSDevExplained';
    person.otherSkills = 'otherSkills';

    return person;
  }

  private getTeamName(studentId: string): string {
    return (
      this.allocationsPrompt
        .filter(a => a.students.includes(studentId))
        .map(a => this.getProjectName(a.projectId))[0] || ''
    );
  }

  private getProjectName(projectId: string): string {
    const project = this.projectsPrompt.find(p => p.id === projectId);
    if (project) {
      return project.name;
    } else {
      return projectId;
    }
  }

  private getDevice(device: DeviceStudent): DevicePerson {
    switch (device) {
      case DeviceStudent.IPad:
        return DevicePerson.Ipad;
      case DeviceStudent.IPhone:
        return DevicePerson.Iphone;
      case DeviceStudent.Mac:
        return DevicePerson.Mac;
      case DeviceStudent.Watch:
        return DevicePerson.Watch;
      default:
        return null;
    }
  }

  private getSkills(studentSkills: SkillStudent[]): SkillPerson[] {
    return studentSkills
      .map(studentSkill => {
        const skillPrompt = this.skillsPrompt.find(s => s.id === studentSkill.id);

        if (!skillPrompt) {
          return null;
        }

        if (skillPrompt.title === null) {
          throw new Error('Skill title is null');
        }
        return new SkillPerson(skillPrompt.title, this.getSkillLevel(studentSkill.proficiency), SkillLevel.None, '');
      })
      .filter(skill => skill !== null);
  }

  private getIOSDev(skillProficiency: SkillProficiency): string {
    switch (skillProficiency) {
      case SkillProficiency.Novice:
        return 'I have no experience in Apple platform development other than the intro course.';
      case SkillProficiency.Intermediate:
        return 'I was involved in the development of a native Apple application, but I had another role than developer (e.g. tester).';
      case SkillProficiency.Advanced:
        return 'I have been an active developer for a native Apple application.';
      case SkillProficiency.Expert:
        return 'I have submitted my own native Apple application(s) to the AppStore.';
    }
  }

  private getLanguageProficiency(student: Student, languageCode: string): LanguageProficiency {
    const language = student.languages.filter(l => l.language === languageCode);
    if (language.length) {
      return language[0].proficiency;
    } else {
      return LanguageProficiency.A1A2; // default proficiency
    }
  }

  private getSkillLevel(skillProficiency: SkillProficiency): SkillLevel {
    switch (skillProficiency) {
      case SkillProficiency.Novice:
        return SkillLevel.Low;
      case SkillProficiency.Intermediate:
        return SkillLevel.Medium;
      case SkillProficiency.Advanced:
        return SkillLevel.High;
      case SkillProficiency.Expert:
        return SkillLevel.VeryHigh;
    }
  }

  private getGender(gender: GenderStudent): GenderPerson {
    switch (gender) {
      case GenderStudent.Male:
        return GenderPerson.Male;
      default:
        return GenderPerson.Female;
    }
  }
}
