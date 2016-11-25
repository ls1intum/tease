import {Component} from '@angular/core';
import {Person} from "./shared/models/person";

@Component({
  selector   : 'app',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private persons: Person[];

  onPersonDataParsed(persons: Person[]){
    console.log(persons);
  }
}
