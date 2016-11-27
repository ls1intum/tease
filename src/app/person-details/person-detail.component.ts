import {Component, OnInit} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
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

  constructor(public dialogRef: MdDialogRef<PersonDetailComponent>) {

  }

  ngOnInit(): void {

  }
}
