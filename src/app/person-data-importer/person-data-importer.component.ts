import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";
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
  constructor(private personService: PersonService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  onFileChanged(event){
    let files = event.srcElement.files;
    if(files.length != 1)return;

    this.personService.parsePersons(files[0], persons => {
      this.personService.savePersons(persons)

      this.gotoPersonList();
    });
  }

  gotoPersonList(){
    let link = ["/persons"];
    this.router.navigate(link);
  }
}
