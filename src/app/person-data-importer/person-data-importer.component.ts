import {Component, OnInit} from "@angular/core";
/**
 * Created by wanur on 18/11/2016.
 */
import Papa = require("papaparse");


@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ['./person-data-importer.component.css'],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit {
  ngOnInit(): void {
     // let fileReader = new FileReader();

    console.log("data: "+Papa.parse("d,dududu,d").data[0]);

    Papa.parse("3,3,3", {
      delimiter: ',',
      comments: false,

      step: function(results, p) {
        p.abort();
        console.log(results.data.length);
      }
    });
  }

  onFileChanged(event){
    let files = event.srcElement.files;
    if(files.length != 1)return;

    Papa.parse(files[0], {
      complete: function(results){
        console.log(results);
      }
    });
  }
}
