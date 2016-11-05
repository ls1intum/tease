import {Component, OnInit} from "@angular/core";
import {PersonService} from "../shared/services/person-list.service";
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

  constructor(private personService: PersonService){

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
