import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../shared/models/person';
import {Skill, SkillLevel} from '../../shared/models/skill';
import {Colors} from '../../shared/constants/color.constants';
import {Device} from '../../shared/models/device';
import {Team} from '../../shared/models/team';
import {IconMapperService} from '../../shared/ui/icon-mapper.service';
import {OverlayComponent} from '../../overlay.service';
import {CSVConstants} from "../../shared/constants/csv.constants";

@Component({
  selector: 'app-person-detail-overlay',
  templateUrl: './person-detail-overlay.component.html',
  styleUrls: ['./person-detail-overlay.component.scss']
})
export class PersonDetailOverlayComponent implements OnInit, OverlayComponent {
  public data: {person: Person, onClose: () => void};

  protected getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  protected getSkillColor = Colors.getColor;
  protected getGravatarIcon = this.iconMapperService.getGravatarIcon;

  Device = Device;
  CSVConstants = CSVConstants;
  SkillLevel = SkillLevel;

  constructor(private iconMapperService: IconMapperService) { }

  ngOnInit() {}

  getGenderIconPath(): string {
    return this.iconMapperService.getGenderIconPath(this.data.person.gender);
  }

  isPersonRated(): boolean {
    return this.data.person.supervisorRating !== undefined && this.data.person.supervisorRating !== SkillLevel.None;
  }

  getSupervisorRatingColor(): string {
    return Colors.getColor(this.data.person.supervisorRating);
  }

  getDeviceIconPath(device: Device): string {
    return this.iconMapperService.getDeviceTypeIconPath(device);
  }

  filterSkills(skills: Skill[], skillLevel: number) {
    return skills.filter(function(skill) { return skill.skillLevel === skillLevel; });
  }

  range(count: number): number[] {
    return Array.apply(null, Array(count)).map(function (_, i) {return i; });
  }

  isInTeam(person: Person): boolean {
    return person.team.name !== Team.OrphanTeamName;
  }
}
