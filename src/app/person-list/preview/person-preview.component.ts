import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {Md5} from 'ts-md5/dist/md5';
import {SkillLevel} from "../../shared/models/skill";
import {Colors} from "../../shared/constants/color-constants";

/**
 * Created by Malte Bucksch on 28/11/2016.
 */



@Component({
  templateUrl: 'person-preview.component.html',
  selector: 'person-preview',
  styleUrls: ['person-preview.component.css']
})
export class PersonPreviewComponent {
  private static readonly GRAVATAR_URL="http://www.gravatar.com/avatar/";
  @Input()
  person: Person;
  constructor(private imageService: IconMapperService){

  }

  getColor(): string{
    return Colors.getColor(this.person.supervisorRating);
  }

  getSkillIconPath(): string{
    return this.imageService.getSkillIcon(this.person.supervisorRating);
  }

  getGenderIconPath(): string{
    return this.imageService.getGenderIcon(this.person.gender);
  }

  getGravatarIconPath(): string {
    if(this.person.email == undefined)return PersonPreviewComponent.GRAVATAR_URL;

    let emailHash = Md5.hashStr(this.person.email);
    return PersonPreviewComponent.GRAVATAR_URL+emailHash;
  }
}
