import { Component, Input, OnInit } from '@angular/core';
import { Student, Device, SkillProficiency, LanguageProficiency } from 'src/app/api/models';
import { OverlayService } from 'src/app/overlay.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { GenderService } from 'src/app/shared/helpers/gender.service';
import { GravatarService } from 'src/app/shared/helpers/gravatar.service';
import { NationalityService } from 'src/app/shared/helpers/nationality.service';
import { TeamService } from 'src/app/shared/layers/business-logic-layer/team.service';
import { facIpadIcon, facIphoneIcon, facMacIcon, facWatchIcon } from 'src/assets/icons/icons';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';

class AssignedProjectPreference {
  name: string;
  priority: number;
  assigned: boolean;
}
@Component({
  selector: 'app-student-preview-card',
  templateUrl: './student-preview-card.component.html',
  styleUrl: './student-preview-card.component.scss',
})
export class StudentPreviewCardComponent implements OnInit {
  @Input({ required: true }) student: Student;
  @Input() projectId: string;
  Device = Device;
  private readonly PROJECT_PREFRENCE_LIMIT = 4;

  facMacIcon = facMacIcon;
  facIphoneIcon = facIphoneIcon;
  facIpadIcon = facIpadIcon;
  facWatchIcon = facWatchIcon;

  projectPreferences: AssignedProjectPreference[];
  projectPreferenceScore: string;
  germanProficiency: string;
  nationalityText: string;
  nationalityEmoji: string;
  genderIcon: string;
  gravatarURL: string;
  skillColors: string[];
  name: string;
  ownsMac: boolean;
  ownsIPhone: boolean;
  ownsIPad: boolean;
  ownsWatch: boolean;

  constructor(
    private nationalityService: NationalityService,
    private projectsService: ProjectsService,
    private genderService: GenderService,
    private gravatarService: GravatarService,
    private teamService: TeamService,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    if (!this.student) throw Error();
    this.projectPreferences = this.getDisplayedProjectPreferences();
    this.projectPreferenceScore = this.getProjectPreferenceScore();
    this.germanProficiency = this.findGermanProficiency();
    this.nationalityText = this.nationalityService.getNameFromCode(this.student.nationality);
    this.nationalityEmoji = this.nationalityService.getEmojiFromCode(this.student.nationality);
    this.genderIcon = this.genderService.getIconFromGender(this.student.gender);
    this.gravatarURL = this.gravatarService.getGravatarURLFromMail(this.student.email);
    this.skillColors = this.mapSkillProficiencyToSkillColors(this.student.introCourseProficiency);
    this.ownsMac = this.student.devices.includes(Device.Mac);
    this.ownsIPhone = this.student.devices.includes(Device.IPhone);
    this.ownsIPad = this.student.devices.includes(Device.IPad);
    this.ownsWatch = this.student.devices.includes(Device.Watch);
    this.name = `${this.student.firstName} ${this.student.lastName}`;
  }

  private getProjectPreferenceScore(): string {
    if (this.projectId) {
      return (
        (
          this.student.projectPreferences.find(project => project.projectId === this.projectId).priority + 1
        ).toString() || '#'
      );
    }
    return '#';
  }

  private getProjectPreferences(): AssignedProjectPreference[] {
    return this.student.projectPreferences
      .sort((a, b) => a.priority - b.priority)
      .map(project => ({
        priority: project.priority + 1,
        name: this.projectsService.getProjectNameById(project.projectId),
        assigned: this.projectId === project.projectId,
      }));
  }

  private getDisplayedProjectPreferences(): AssignedProjectPreference[] {
    const projectPreferences = this.getProjectPreferences();
    return projectPreferences.slice(0, this.PROJECT_PREFRENCE_LIMIT);
  }

  private findGermanProficiency(): LanguageProficiency {
    return this.student.languages.find(language => language.language === 'de').proficiency;
  }

  private mapSkillProficiencyToSkillColors(skillProficiency): string[] {
    switch (skillProficiency) {
      case SkillProficiency.Novice:
        return [...Array(1).fill('novice'), ...Array(3).fill('inactive')];
      case SkillProficiency.Intermediate:
        return [...Array(2).fill('intermediate'), ...Array(2).fill('inactive')];
      case SkillProficiency.Advanced:
        return [...Array(3).fill('advanced'), ...Array(1).fill('inactive')];
      case SkillProficiency.Expert:
        return Array(4).fill('expert');
    }
    return Array(4).fill('inactive');
  }

  showPersonDetails(student: Student) {
    const person = this.teamService.persons.find(person => person.tumId === student.id);
    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      person: person,
    });
  }
}
