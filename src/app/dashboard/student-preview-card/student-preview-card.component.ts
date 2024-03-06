import { Component, Input, OnInit } from '@angular/core';
import { Student, Device } from 'src/app/api/models';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { GenderService } from 'src/app/shared/helpers/gender.service';
import { GravatarService } from 'src/app/shared/helpers/gravatar.service';
import { NationalityService } from 'src/app/shared/helpers/nationality.service';

@Component({
  selector: 'app-student-preview-card',
  templateUrl: './student-preview-card.component.html',
  styleUrl: './student-preview-card.component.scss',
})
export class StudentPreviewCardComponent implements OnInit {
  @Input({ required: true }) student: Student;
  @Input() projectId: string;
  Device = Device;
  private readonly projectPreferenceLimit = 4;

  constructor(
    private nationalityService: NationalityService,
    private projectsService: ProjectsService,
    private genderService: GenderService,
    private gravatarService: GravatarService
  ) {}

  ngOnInit() {
    this.projectPreferences = this.getProjectPreferences().slice(0, this.projectPreferenceLimit);
    this.projectPreferenceScore = this.getProjectPreferenceScore();
    this.germanProficiency = this.student.languages.find(l => l.language === 'de').proficiency;
    this.nationalityText = this.nationalityService.getNameFromCode(this.student.nationality);
    this.nationalityEmoji = this.nationalityService.getEmojiFromCode(this.student.nationality);
    this.genderIcon = this.genderService.getIconFromGender(this.student.gender);
    this.gravatarURL = this.gravatarService.getGravatarURLFromMail(this.student.email);
    this.skillProficiency = this.student.introCourseProficiency.toLowerCase();
    this.name = `${this.student.firstName} ${this.student.lastName}`;
  }

  projectPreferences: { name: string; assigned: boolean }[];
  projectPreferenceScore: string;
  germanProficiency: string;
  nationalityText: string;
  nationalityEmoji: string;
  genderIcon: string;
  gravatarURL: string;
  skillProficiency: string;
  name: string;

  private getProjectPreferenceScore(): string {
    if (this.projectId) {
      return (this.student.projectPreferences.find(p => p.projectId === this.projectId).priority + 1).toString() || '#';
    }
    return '#';
  }

  private getProjectPreferences(): { name: string; assigned: boolean }[] {
    return this.student.projectPreferences
      .sort((a, b) => a.priority - b.priority)
      .map(p => ({
        priority: p.priority + 1,
        name: this.projectsService.getProjectNameById(p.projectId),
        assigned: this.projectId === p.projectId,
      }));
  }
}
