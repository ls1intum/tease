import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../shared/models/student';
import { Colors } from '../../shared/constants/color.constants';
import { SkillLevel } from 'src/app/shared/models/generated-model/skillLevel';
import { DeviceType } from '../../shared/models/generated-model/device';
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
  @Input() student: Student;
  @Input() pinable = true;

  SkillLevel = SkillLevel;
  Device = DeviceType;
  StudentConstraintService = StudentConstraintService;
  getFlagEmojiFromNationality = NationalityHelper.getFlagEmojiFromNationality

  /* functions used in template */
  protected getGravatarIcon = IconMapperService.getGravatarIcon;
  protected getGenderIconPath = IconMapperService.getGenderIconPath;
  protected getColor = Colors.getColor;
  protected getDeviceTypeIconPath = IconMapperService.getDeviceTypeIconPath;

  constructor(public teamService: TeamService) {}

  ngOnInit() {
    if (!this.pinable) this.student.isPinned = false;
  }

  isStudentRated(): boolean {
    return this.student.supervisorAssessment !== undefined;
  }

  getFirstLetterOfSkillLevelName(skillLevel: SkillLevel): string {
    return skillLevel.charAt(0);
  }

  getSupervisorAssessmentString(): string {
    return this.student.supervisorAssessment;
  }
}
