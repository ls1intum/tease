import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../shared/models/person';
import { Colors } from '../../shared/constants/color.constants';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { IconMapperService } from '../../shared/ui/icon-mapper.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { PersonConstraintService } from '../../shared/layers/business-logic-layer/person-constraint.service';
import { NationalityHelper } from '../../shared/helpers/nationality.helper';

@Component({
  selector: 'app-person-preview',
  templateUrl: './person-preview.component.html',
  styleUrls: ['./person-preview.component.scss'],
})
export class PersonPreviewComponent implements OnInit {
  @Input() person: Person;
  @Input() pinable = true;

  SkillLevel = SkillLevel;
  Device = Device;
  PersonConstraintService = PersonConstraintService;
  getFlagEmojiFromNationality = NationalityHelper.getFlagEmojiFromNationality;

  /* functions used in template */

  protected getGenderIconPath = IconMapperService.getGenderIconPath;
  protected getColor = Colors.getColor;
  protected getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  protected getDeviceTypeIconPath = IconMapperService.getDeviceTypeIconPath;

  constructor(public teamService: TeamService) {}

  ngOnInit() {
    if (!this.pinable) this.person.isPinned = false;
  }

  isPersonRated(): boolean {
    return this.person.supervisorRating !== undefined && this.person.supervisorRating !== SkillLevel.None;
  }

  getFirstLetterOfSkillLevelName(skillLevel: SkillLevel): string {
    return this.getLabelForSkillLevel(skillLevel).charAt(0);
  }

  getSupervisorRatingString(): string {
    return Skill.getLabelForSkillLevel(this.person.supervisorRating);
  }
}
