
import {NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PersonDetailComponent} from "./person-detail.component";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/services/person-list.service";
import {ActivatedRoute} from "@angular/router";
@NgModule({
  imports: [CommonModule],
  declarations: [PersonDetailComponent],
  exports: [PersonDetailComponent],
})
export class PersonDetailModule implements OnInit {
  person: Person;

  constructor(private personService: PersonService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.forEach(params => {
      let id = +params['id'];
      this.personService.getPerson(id).then(person =>
        this.person = person
      )
    })
  }
}
