import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Student, Device, SkillProficiency, LanguageProficiency } from 'src/app/api/models';
import { OverlayService } from 'src/app/overlay.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { GenderService } from 'src/app/shared/helpers/gender.service';
import { GravatarService } from 'src/app/shared/helpers/gravatar.service';
import { NationalityService } from 'src/app/shared/helpers/nationality.service';
import { teaseIconPack } from 'src/assets/icons/icons';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';
import { ColorService } from 'src/app/shared/constants/color.service';
import { LocksService } from 'src/app/shared/data/locks.service';
import { SkillViewMode } from '../navigation-bar/navigation-bar.component';

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
  @Input() lockedStudents: string[] = [];
  Device = Device;
  private readonly PROJECT_PREFRENCE_LIMIT = 4;

  facMacIcon = teaseIconPack['facMacIcon'];
  facIphoneIcon = teaseIconPack['facIphoneIcon'];
  facIpadIcon = teaseIconPack['facIpadIcon'];
  facWatchIcon = teaseIconPack['facWatchIcon'];
  facLockClosedIcon = teaseIconPack['facLockClosedIcon'];
  facLockOpenIcon = teaseIconPack['facLockOpenIcon'];

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
  isLocked: boolean;

  //Delete after Kickoff
  ViewMode = SkillViewMode;
  selectedViewMode: SkillViewMode;
  backgroundColor: string;

  constructor(
    private nationalityService: NationalityService,
    private projectsService: ProjectsService,
    private genderService: GenderService,
    private gravatarService: GravatarService,
    private overlayService: OverlayService,
    private locksService: LocksService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLocked = this.lockedStudents.includes(this.student.id);
    //Delete after Kickoff
    const localViewMode = localStorage.getItem('skillViewMode') ?? SkillViewMode.CIRCLE;
    this.selectedViewMode = localViewMode as SkillViewMode;
    this.backgroundColor = this.getBackgroundColor(this.student.introCourseProficiency, this.selectedViewMode);

    this.projectPreferences = this.getDisplayedProjectPreferences();
    this.projectPreferenceScore = this.getProjectPreferenceScore();
    this.germanProficiency = this.findGermanProficiency();
    this.nationalityText = this.nationalityService.getNameFromCode(this.student.nationality);
    this.nationalityEmoji = this.nationalityService.getEmojiFromCode(this.student.nationality);
    this.genderIcon = this.genderService.getIconFromGender(this.student.gender);
    this.gravatarURL = this.gravatarService.getGravatarURLFromMail(this.student.email);
    this.skillColors = ColorService.mapSkillProficiencyToSkillColors(this.student.introCourseProficiency);
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

  showPersonDetails(student: Student) {
    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      student: student,
      projectId: this.projectId,
    });
  }

  toggleLock() {
    if (this.isLocked) {
      this.locksService.removeLock(this.student.id);
      this.isLocked = false;
    } else {
      this.locksService.addLock(this.student.id, this.projectId);
      this.isLocked = true;
    }
  }

  //Delete after Kickoff
  private getBackgroundColor(skillProficiency: SkillProficiency, viewMode: SkillViewMode): string {
    if (viewMode != SkillViewMode.DEATH) {
      return '#F9F9FA';
    }
    switch (skillProficiency) {
      case SkillProficiency.Expert:
        return '#BCDEF7';
      case SkillProficiency.Advanced:
        return '#E7F7E2';
      case SkillProficiency.Intermediate:
        return '#F5ECCD';
      case SkillProficiency.Novice:
        return '#EFC6C6';
      default:
        return '#F9F9FA';
    }
  }
}
