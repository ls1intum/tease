import {Component, OnInit, ViewContainerRef, OnDestroy} from "@angular/core";
import {Person} from "../../shared/models/person";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {DialogService, EventTypePersonDetails} from "../../shared/ui/dialog.service";
import {Team} from "../../shared/models/team";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangPersonList} from "../../shared/constants/language.constants";
import {TeamHelper} from "../../shared/helpers/team.helper";
import {Subscription} from "rxjs";
import {PersonService} from "../../shared/layers/business-logic-layer/person.service";
import {CustomPersonDetailDialogService} from "../../shared/ui/custom-person-detail-dialog.service";
/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  templateUrl: 'person-list.component.html',
  styleUrls: ['person-list.component.css'],
  selector: 'person-list'
})
export class PersonListComponent implements OnInit, OnDestroy {
  private persons: Person[];
  private teams: Team[];
  private nextSubscription: Subscription;

  constructor(private teamService: TeamService,
              private router: Router,
              private personService: PersonService,
              private viewContainerRef: ViewContainerRef,
              private dialogService: DialogService,
              private toolbarService: ToolbarService,
              private customPersonDetailDialogService: CustomPersonDetailDialogService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangPersonList.ToolbarButtonName);
  }

  ngOnInit(): void {
    this.teamService.readSavedTeams().then(teams => {
        this.teams = teams;
        this.persons = TeamHelper.getPersons(teams);

        if (this.persons == undefined || this.persons.length == 0) {
          this.gotoImport();
        } else {
          this.nextSubscription = this.toolbarService.buttonClicked.subscribe(() => {
            this.gotoTeamGeneration();
          });
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.nextSubscription.unsubscribe();
  }

  gotoTeamGeneration(): Promise<boolean> {
    let link = ["/constraints"];
    return this.router.navigate(link);
  }

  gotoDetail(person: Person) {
    /*
    this.dialogService.showPersonDetails(person, this.persons, this.viewContainerRef)
      .subscribe(event => {
        this.teamService.saveTeams(this.teams);

        if (event === EventTypePersonDetails.NextPersonPressed)
          this.showNextUnratedPerson();
      });
      */

    this.customPersonDetailDialogService.displayedPersonEventEmitter.emit(person);
  }

  showNextUnratedPerson() {
    let nextPerson = this.personService.getNextUnratedPerson(this.persons);
    if (nextPerson === undefined) {
      console.log("Already rated all persons");
      return;
    }

    this.gotoDetail(nextPerson);
  }

  gotoImport(): Promise<boolean> {
    let link = ["/import"];
    return this.router.navigate(link);
  }
}
