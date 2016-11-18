import {Component, OnInit} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonListService} from "../shared/person-list/person-list.service";
import {ActivatedRoute} from "@angular/router";
import { MaterialModule } from '@angular/material';


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

  constructor(public personService: PersonListService,
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
