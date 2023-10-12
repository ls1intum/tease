import { Component, Input } from '@angular/core';
import { Person } from '../../shared/models/person';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { Colors } from '../../shared/constants/color.constants';
import { CSVConstants } from '../../shared/constants/csv.constants';
import { IconMapperService } from '../../shared/ui/icon-mapper.service';
import { Device } from '../../shared/models/device';
import { NationalityHelper } from '../../shared/helpers/nationality.helper';

@Component({
  selector: 'app-person-detail-card',
  templateUrl: './person-detail-card.component.html',
  styleUrls: ['./person-detail-card.component.scss'],
})
export class PersonDetailCardComponent {
  @Input() person: Person;

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  getGravatarIcon = IconMapperService.getGravatarIcon;
  SkillLevel = SkillLevel;
  CSVConstants = CSVConstants;
  Device = Device;
  getFlagEmojiFromNationality = NationalityHelper.getFlagEmojiFromNationality;

  isPersonRated(): boolean {
    return this.person.supervisorRating !== undefined && this.person.supervisorRating !== SkillLevel.None;
  }

  getSupervisorRatingColor(): string {
    return Colors.getColor(this.person.supervisorRating);
  }

  getGenderIconPath(): string {
    return IconMapperService.getGenderIconPath(this.person.gender);
  }

  getDeviceIconPath(device: Device): string {
    return IconMapperService.getDeviceTypeIconPath(device);
  }
}
