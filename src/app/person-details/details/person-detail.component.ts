import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Person} from "../../shared/models/person";
import {MaterialModule, MdDialogRef, MdRadioGroup} from '@angular/material';
import {SkillLevel} from "../../shared/models/skill";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {Observable, Subject} from "rxjs";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";


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
  persons: Person[];

  // enums can only be used in a template with this shitty work around.
  // how stupid is angular 2 here?
  public PersonSkillLevel = SkillLevel;
  // work around for setting the value of the radio group on init
  // again: wtf. enums dont seem to be well integrated into typescript/angular
  private skillString: string;
  private isNextButtonDisabled = false;
  private nextPersonClickSubject = new Subject<any>();

  constructor(public dialogRef: MdDialogRef<PersonDetailComponent>,
              private iconMapperService: IconMapperService,
              private personStatisticsService: PersonStatisticsService) {
  }

  ngOnInit(): void {
    this.skillString = this.person.supervisorRating.toString();
    this.setNextButtonState();
  }

  private setNextButtonState(){
    this.isNextButtonDisabled = this.isEveryPersonRated() || !this.person.hasSupervisorRating();
  }

  private isEveryPersonRated(): boolean {
    return this.personStatisticsService.getRatedPersonCount(this.persons) === this.persons.length;
  }

  private onChangeRating(value: string) {
    this.person.supervisorRating = +value;
    this.setNextButtonState();
  }

  private getRatedPersonCount(): number {
    return this.personStatisticsService.getRatedPersonCount(this.persons);
  }

  private getPersonCount() {
    return this.persons.length;
  }

  private onNextPersonClicked() {
    this.dialogRef.close();
    this.nextPersonClickSubject.next();
  }

  getGravatarIconPath(): string {
    return this.iconMapperService.getGravatarIcon(this.person.email);
  }

  nextPersonClicked(): Observable<any> {
    return this.nextPersonClickSubject.asObservable();
  }
}
