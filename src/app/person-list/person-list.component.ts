import {Component, OnInit} from "@angular/core";
import {PersonListService} from "../shared/layers/business-logic-layer/person-list.service";
import {Person} from "../shared/models/person";
import {Router} from "@angular/router";
/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  templateUrl: 'person-list.component.html',
  styleUrls: ['person-list.component.css'],
  selector: 'person-list'
})
export class PersonListComponent implements OnInit {
  persons: Person[];

  constructor(private personService: PersonListService,
  private router: Router){

  }

  ngOnInit(): void {
    this.personService.getSavedPersons().then(
      persons => this.persons = persons
    )
  }

  gotoDetail(person: Person){
    let link = ["/detail", person.id];
    this.router.navigate(link);
  }
}
