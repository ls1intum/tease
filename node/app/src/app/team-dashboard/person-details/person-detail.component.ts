import {Component, OnInit, Input} from "@angular/core";
import {Person} from "../../shared/models/person";
import {MaterialModule, MdDialogRef, MdRadioGroup} from '@angular/material';
import {Skill, SkillLevel} from "../../shared/models/skill";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {Observable, Subject} from "rxjs";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {Colors} from "../../shared/constants/color.constants";
import {Device} from "../../shared/models/device";
import {Team} from "../../shared/models/team";

/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  selector: 'person-detail',
  templateUrl: 'person-detail.component.html',
  styleUrls: ["person-detail.component.css"]
})
export class PersonDetailComponent implements OnInit {
  @Input() person: Person;
  persons: Person[] = [];

  // enums can only be used in a template with this shitty work around.
  // how stupid is angular 2 here?
  public PersonSkillLevel = SkillLevel;
  // work around for setting the value of the radio group on init
  // again: wtf. enums dont seem to be well integrated into typescript/angular
  private skillString: string;
  private isNextButtonDisabled = false;
  private nextPersonClickSubject = new Subject<any>();
  private openAsPopupClickSubject = new Subject<any>();

  private isDialog = false;

  constructor(private iconMapperService: IconMapperService,
              private personStatisticsService: PersonStatisticsService) {  }

  ngOnInit(): void {
    if (this.person !== undefined) {
      this.init();
      return;
    }

    this.fetchPersonFromUrlId();
  }

  private fetchPersonFromUrlId() {
    /*
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id === undefined){
        console.log("No id for fetching given!");
        return;
      }

      this.teamService.readPersonWithId(params['id'])
        .then(person => {
          this.isDialog = true;

          this.person = person;
          this.init();
          this.toolbarService.setToolbarVisible(false);
        })
    });
    */
  }

  private init() {
    this.skillString = this.person.supervisorRating.toString();
    this.setNextButtonState();
  }

  private setNextButtonState() {
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

  private shouldShowRatingToolbar(): boolean {
    return this.persons.length != 0;
  }

  getGravatarIconPath(): string {
    return this.iconMapperService.getGravatarIcon(this.person.email);
  }

  private onOpenInPopupClicked() {
    this.openAsPopupClickSubject.next();

    let url = "/#/persons/"+this.person.tumId;
    window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  private onNextPersonClicked() {
    this.nextPersonClickSubject.next();
  }

  nextPersonClicked(): Observable<any> {
    return this.nextPersonClickSubject.asObservable();
  }
  openAsPopupClicked(): Observable<any> {
    return this.openAsPopupClickSubject.asObservable();
  }

  // qusc
  getGenderIconPath(): string {
    return this.iconMapperService.getGenderIconPath(this.person.gender);
  }

  isPersonRated():boolean {
    return this.person.supervisorRating != undefined && this.person.supervisorRating != SkillLevel.None;
  }

  getSupervisorRatingColor(): string {
    return Colors.getColor(this.person.supervisorRating);
  }

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;

  getDeviceIconPath(device: Device): string {
    return this.iconMapperService.getDeviceTypeIconPath(device.deviceType);
  }

  private getSkillColor = Colors.getColor;

  filterSkills(skills: Skill[], skillLevel: number) {
    return skills.filter(function(skill) { return skill.skillLevel == skillLevel });
  }

  range(count: number): number[] {
    return Array.apply(null, Array(count)).map(function (_, i) {return i;});
  }

  isInTeam(person: Person): boolean {
    return person.team.name != Team.OrphanTeamName;
  }
}
