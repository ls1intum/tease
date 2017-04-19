import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {SkillLevel} from "../../shared/models/skill";
import {Colors} from "../../shared/constants/color.constants";
import {Device} from "../../shared/models/device";

/**
 * Created by Malte Bucksch on 28/11/2016.
 */



@Component({
  templateUrl: 'person-preview.component.html',
  selector: 'person-preview',
  styleUrls: ['person-preview.component.css']
})
export class PersonPreviewComponent {
  @Input()
  person: Person;
  constructor(private iconMapperService: IconMapperService){

  }

  getColor(): string{
    return Colors.getColor(this.person.supervisorRating);
  }

  getSkillIconPath(): string{
    return this.iconMapperService.getSkillIconPath(this.person.supervisorRating);
  }

  getGenderIconPath(): string{
    return this.iconMapperService.getGenderIconPath(this.person.gender);
  }

  getDeviceIconPath(device: Device): string {
    return this.iconMapperService.getDeviceTypeIconPath(device.deviceType);
  }

  getGravatarIconPath(): string {
    return this.iconMapperService.getGravatarIcon(this.person.email);
  }

  isPersonRated():boolean {
    return this.person.supervisorRating != undefined && this.person.supervisorRating != SkillLevel.None;
  }

  getLabelForSkillLevel(skillLevel: SkillLevel) {
    switch(skillLevel) {
      case SkillLevel.Low:
        return "Novice"
      case SkillLevel.Medium:
        return "Normal";
      case SkillLevel.High:
        return "Advanced";
      case SkillLevel.VeryHigh:
        return "Expert";
    }

    return "";
  }
}
