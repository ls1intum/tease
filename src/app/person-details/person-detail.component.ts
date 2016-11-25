import {Component, OnInit} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";
import {ActivatedRoute} from "@angular/router";
import {MaterialModule, MdDialogRef} from '@angular/material';


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

  constructor(public personService: PersonService,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MdDialogRef<PersonDetailComponent>) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.forEach(params => {
      let id = +params['id'];
      this.personService.readPerson(id).then(person =>
        this.person = person
      )
    })
  }
}
