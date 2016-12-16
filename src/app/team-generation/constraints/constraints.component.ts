import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangConstraints} from "../../shared/constants/language-constants";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation.service";

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
            private teamGenerationService: TeamGenerationService,
              private toolbarService: ToolbarService,
              private teamService: TeamService) {
    this.toolbarService.changeButtonName(LangConstraints.ToolbarButtonName);
    this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoDashboard();
    });

  }

  ngOnInit(): void {
  }

  onGenerateClicked(){
    this.teamService.read().then(teams => {
      this.teamGenerationService.generate(teams);
      this.teamService.save(teams);

      this.gotoDashboard();
    });
  }

  gotoDashboard(){
    let link = ["/dashboard"];
    this.router.navigate(link);
  }
}
