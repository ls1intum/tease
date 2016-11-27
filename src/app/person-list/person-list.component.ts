import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {Person} from "../shared/models/person";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {PersonDetailComponent} from "../person-details/person-detail.component";
/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  templateUrl: 'person-list.component.html',
  styleUrls: ['person-list.component.css'],
  selector: 'person-list'
})
export class PersonListComponent implements OnInit {
  private persons: Person[];
  private dialogRef: MdDialogRef<PersonDetailComponent>;

  constructor(private personService: PersonService,
              private router: Router,
              public dialog: MdDialog,
              public viewContainerRef: ViewContainerRef) {

  }

  ngOnInit(): void {
    this.personService.readPersons().then(
      persons => {
        this.persons = persons;

        if (persons == undefined || persons.length == 0)
          this.gotoImport();
      }
    )
  }

  gotoDetail(person: Person) {
    // let link = ["/detail", person.id];
    // this.router.navigate(link);
    if(this.dialogRef != undefined)this.dialogRef.close();

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(PersonDetailComponent, config);
    this.dialogRef.componentInstance.person = person;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = undefined;
    });
  }

  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }
}
