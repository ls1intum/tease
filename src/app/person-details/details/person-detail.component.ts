import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Person} from "../../shared/models/person";
import {MaterialModule, MdDialogRef, MdRadioGroup} from '@angular/material';
import {SkillLevel} from "../../shared/models/skill";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";


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
  // enums can only be used in a template with this shitty work around.
  // how stupid is angular 2 here?
  public PersonSkillLevel = SkillLevel;
  // work around for setting the value of the radio group on init
  // again: wtf. enums dont seem to be well integrated into typescript/angular
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
