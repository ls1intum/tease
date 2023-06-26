import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../shared/models/student';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { Colors } from '../../shared/constants/color.constants';
import { CSVConstants } from '../../shared/constants/csv.constants';
import { IconMapperService } from '../../shared/ui/icon-mapper.service';
import { Device } from '../../shared/models/device';
import { NationalityHelper } from '../../shared/helpers/nationality.helper';

@Component({
  selector: 'app-student-detail-card',
  templateUrl: './student-detail-card.component.html',
  styleUrls: ['./student-detail-card.component.scss'],
})
export class StudentDetailCardComponent implements OnInit {
  @Input() student: Student;

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  getLabelForSelfAssessmentLevel = Skill.getLabelForSelfAssessmentLevel;
  getGravatarIcon = IconMapperService.getGravatarIcon;
  SkillLevel = SkillLevel;
  CSVConstants = CSVConstants;
  Device = Device;
  getFlagEmojiFromNationality = NationalityHelper.getFlagEmojiFromNationality

  constructor() {}

  ngOnInit() {}

  isStudentRated(): boolean {
    return this.student.supervisorAssessment !== undefined && this.student.supervisorAssessment !== SkillLevel.None;
  }

  getSupervisorAssessmentColor(): string {
    return Colors.getColor(this.student.supervisorAssessment);
  }

  getGenderIconPath(): string {
    return IconMapperService.getGenderIconPath(this.student.gender);
  }

  getDeviceIconPath(device: Device): string {
    return IconMapperService.getDeviceTypeIconPath(device);
  }
}
