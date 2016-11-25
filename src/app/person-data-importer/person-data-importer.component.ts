import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonListService} from "../shared/layers/business-logic-layer/person-list.service";
import {Router} from "@angular/router";

/**
 * Created by wanur on 18/11/2016.
 */

@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ['./person-data-importer.component.css'],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit {
  @Output() onPersonDataParsed = new EventEmitter<Person[]>();

  constructor(private personService: PersonListService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  onFileChanged(event){
    let files = event.srcElement.files;
    if(files.length != 1)return;

    this.personService.readPersons(files[0], persons => {
      this.onPersonDataParsed.emit(persons);
    });
  }
}
