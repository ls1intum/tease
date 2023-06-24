import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../shared/models/student';
import { Colors } from '../../shared/constants/color.constants';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { IconMapperService } from '../../shared/ui/icon-mapper.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { StudentConstraintService } from '../../shared/layers/business-logic-layer/student-constraint.service';
import { NationalityHelper } from '../../shared/helpers/nationality.helper';

@Component({
  selector: 'app-student-preview',
  templateUrl: './student-preview.component.html',
  styleUrls: ['./student-preview.component.scss'],
})
export class StudentPreviewComponent implements OnInit {
  @Input() person: Student;
  @Input() pinable = true;

  SkillLevel = SkillLevel;
  Device = Device;
  PersonConstraintService = StudentConstraintService;
  getFlagEmojiFromNationality = NationalityHelper.getFlagEmojiFromNationality

  /* functions used in template */
  protected getGravatarIcon = IconMapperService.getGravatarIcon;
  protected getGenderIconPath = IconMapperService.getGenderIconPath;
  protected getColor = Colors.getColor;
  protected getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  protected getDeviceTypeIconPath = IconMapperService.getDeviceTypeIconPath;

  constructor(public teamService: TeamService) {}

  ngOnInit() {
    if (!this.pinable) this.person.isPinned = false;
  }

  isPersonRated(): boolean {
    return this.person.supervisorAssessment !== undefined && this.person.supervisorAssessment !== SkillLevel.None;
  }

  getFirstLetterOfSkillLevelName(skillLevel: SkillLevel): string {
    return this.getLabelForSkillLevel(skillLevel).charAt(0);
  }

  getSupervisorAssessmentString(): string {
    return Skill.getLabelForSkillLevel(this.person.supervisorAssessment);
  }
}
