import {Component, OnInit} from "@angular/core";
/**
 * Created by wanur on 18/11/2016.
 */
///<reference path="./path/to/moment.d.ts" />

declare var Papa: any;

@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ['./person-data-importer.component.css'],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit {
  ngOnInit(): void {
     let fileReader = new FileReader();
  }

  onFileChanged(event){
    let files = event.srcElement.files;
    if(files.length != 1)return;

    // Papa.parse(files[0], {
    //   complete: function(results){
    //     console.log(results);
    //   }
    // });
    Papa.parse("d,d");
  }
}
