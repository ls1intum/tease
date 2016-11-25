import {Component, OnInit} from "@angular/core";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";
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

  constructor(private personService: PersonService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.personService.readPersons().then(
      persons => {
        this.persons = persons;

        if (persons == null || persons.length == 0)
          this.gotoImport();
      }
    )
  }

  gotoDetail(person: Person) {
    let link = ["/detail", person.id];
    this.router.navigate(link);
  }

  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }
}
