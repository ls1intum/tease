import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangConstraints} from "../../shared/constants/language.constants";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {Constraint} from "../../shared/models/constraints/constraint";
import {ConstraintService} from "../../shared/layers/business-logic-layer/constraint.service";

/**
 * Created by Malte Bucksch on 27/11/2016.
 */

@Component({
  templateUrl: 'constraints.component.html',
  styleUrls: ['constraints.component.css'],
  selector: 'constraints'
})
export class ConstraintsComponent implements OnInit,OnDestroy {
  private skipSubscription;
  private constraints: Constraint[];

  constructor(private router: Router,
              private teamGenerationService: TeamGenerationService,
              private toolbarService: ToolbarService,
              private teamService: TeamService,
              private constraintService: ConstraintService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangConstraints.ToolbarButtonName);
    this.constraints = this.constraintService.fetchConstraints();
  }

  ngOnInit(): void {
    this.skipSubscription = this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoDashboard();
    });
  }

  ngOnDestroy(): void {
    this.constraints.forEach(constraint => this.constraintService.saveConstraint(constraint));
    this.skipSubscription.unsubscribe();
  }

  onGenerateClicked() {
    this.teamService.readSavedTeams().then(teams => {
      this.teamGenerationService.generate(teams);
      this.teamService.saveTeams(teams);

      this.gotoDashboard();
    });
  }

  onConstraintValueChanged(constraint: Constraint, value: string){
    if(isNaN(+value))return;

    constraint.setValue(+value);
  }

  gotoDashboard() {
    let link = ["/dashboard"];
    this.router.navigate(link);
  }
}
