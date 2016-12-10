import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {ActivatedRoute} from "@angular/router";
import {MaterialModule, MdDialogRef, MdRadioGroup} from '@angular/material';
import {SkillLevel} from "../shared/models/skill";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";


/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  selector: 'person-detail',
  templateUrl: 'person-detail.component.html',
  styleUrls: ["person-detail.component.css"]
})
export class PersonDetailComponent implements OnInit {
  person: Person;
  public PersonSkillLevel = SkillLevel;
  private skillString: string;

  constructor(public dialogRef: MdDialogRef<PersonDetailComponent>,
              private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.skillString = this.person.supervisorRating.toString();
  }

  private getTeamPriorities(): string[] {
    return this.person.teamPriorities.map(
      prio => (this.person.teamPriorities.indexOf(prio) + 1) + " " + prio.name)
  }

  onChangeRating(value: string) {
    this.person.supervisorRating = +value;
  }
}
