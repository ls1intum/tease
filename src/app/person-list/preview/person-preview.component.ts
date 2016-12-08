import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person";
/**
 * Created by Malte Bucksch on 28/11/2016.
 */



@Component({
  templateUrl: 'person-preview.component.html',
  selector: 'person-preview',
  styleUrls: ['person-preview.component.css']
})
export class PersonPreviewComponent {
  @Input()
  private person: Person;


}
