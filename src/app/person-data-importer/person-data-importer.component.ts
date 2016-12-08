import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {Router} from "@angular/router";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";

/**
 * Created by wanur on 18/11/2016.
 */

@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ['./person-data-importer.component.css'],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit {
  private isDataAvailable = false;

  constructor(private teamService: TeamService,
              private router: Router) {
    this.checkIfDataAvailable();
  }

  ngOnInit(): void {
  }

  onFileChanged(event){
    let files = event.srcElement.files;
    if(files.length != 1)return;

    this.teamService.readCsv(files[0]).then(teams => {
      this.teamService.save(teams);

      this.gotoPersonList();
    });
  }

  gotoPersonList(){
    let link = ["/persons"];
    this.router.navigate(link);
  }

  checkIfDataAvailable() {
    this.teamService.read().then(
      teams => {
        this.isDataAvailable = teams != undefined && teams.length != 0;
      }
    )
  }
}
