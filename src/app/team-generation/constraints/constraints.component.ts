import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/services/team.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangConstraints} from "../../shared/constants/language-constants";

/**
 * Created by Malte Bucksch on 27/11/2016.
 */

@Component({
  templateUrl: 'constraints.component.html',
  styleUrls: ['constraints.component.css'],
  selector: 'constraints'
})
export class ConstraintsComponent implements OnInit{
  constructor(private router: Router,
            private teamService: TeamService,
              private toolbarService: ToolbarService) {
    this.toolbarService.changeButtonName(LangConstraints.ToolbarButtonName);
    this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoDashboard();
    });

  }

  ngOnInit(): void {
  }

  onGenerateClicked(){

  }

  generateTeams(onFinish: ()=>void){
    // this.personService.readPersons().then(persons => {
    //   this.teamService.generateTeams(persons).then((teams => {
    //     this.teamService.save(teams);
    //     onFinish();
    //   }));
    // });
  }

  gotoDashboard(){
    let link = ["/dashboard"];
    this.router.navigate(link);
  }
}
