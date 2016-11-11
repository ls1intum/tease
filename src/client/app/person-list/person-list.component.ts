import {Component, OnInit} from "@angular/core";
import {PersonListService} from "../shared/person-list/person-list.service";
import {Person} from "../shared/models/person";
/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  moduleId: module.id,
  templateUrl: 'person-list.component.html',
  styleUrls: ['person-list.component.css'],
  selector: 'person-list'
})
export class PersonListComponent implements OnInit {
  persons: Person[];

  constructor(public personService: PersonListService){

  }

  ngOnInit(): void {
    this.personService.getPersons().then(
      persons => this.persons = persons
    )
  }

  gotoDetail(person: Person){
    // TODO implement
    // let link = ["/detail", pokemon.id];
    // this.router.navigate(link);
  }
}
