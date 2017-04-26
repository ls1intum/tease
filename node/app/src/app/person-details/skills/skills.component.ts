import {Component, Input} from "@angular/core";
import {DeviceType, Device} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {Team} from "../../shared/models/team";
import {Skill, SkillLevel} from "../../shared/models/skill";
import {Colors} from "../../shared/constants/color.constants";
/**
 * Created by Malte Bucksch on 17/12/2016.
 */

@Component({
  selector: 'skills',
  templateUrl: 'skills.component.html',
  styleUrls: ["skills.component.css"]
})
export class SkillsComponent {
  @Input()
  private skills: Skill[];
  private getColor = Colors.getColor;

  constructor(private iconMapperService: IconMapperService){

  }

  getSkillName(skill: Skill): string{
    return skill.skillName;
  }

  getSkillLevelName(skill: Skill): string{
    return skill.toString();
  }

  getSkillIconPath(skill: Skill): string {
    return this.iconMapperService.getSkillIconPath(skill.skillLevel);
  }
}
