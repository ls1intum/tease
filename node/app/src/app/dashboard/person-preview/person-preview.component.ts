import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../shared/models/person';
import {IconMapperService} from '../../shared/ui/icon-mapper.service';
import {Colors} from '../../shared/constants/color.constants';
import {Skill, SkillLevel} from '../../shared/models/skill';

@Component({
  selector: 'app-person-preview',
  templateUrl: './person-preview.component.html',
  styleUrls: ['./person-preview.component.scss']
})
export class PersonPreviewComponent implements OnInit {
  @Input()
  protected person: Person;

  /* functions used in template */
  protected getGravatarIcon = this.iconMapperService.getGravatarIcon;
  protected getGenderIconPath = this.iconMapperService.getGenderIconPath;
  protected getColor = Colors.getColor;
  protected getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  protected getDeviceTypeIconPath = this.iconMapperService.getDeviceTypeIconPath;

  constructor(protected iconMapperService: IconMapperService) { }

  ngOnInit() {
  }

  isPersonRated(): boolean {
    return this.person.supervisorRating !== undefined && this.person.supervisorRating !== SkillLevel.None;
  }

}
