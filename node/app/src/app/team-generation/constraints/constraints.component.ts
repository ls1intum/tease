import {Component, OnInit, OnDestroy, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangConstraints} from "../../shared/constants/language.constants";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {ConstraintType, Constraint} from "../../shared/models/constraints/constraint";
import {ConstraintService} from "../../shared/layers/business-logic-layer/constraint.service";

/**
 * Created by Malte Bucksch on 27/11/2016.
 */

@Component({
  templateUrl: 'constraints.component.html',
  styleUrls: ['constraints.component.css'],
  selector: 'constraints'
})
export class ConstraintsComponent implements OnInit, OnDestroy {
  // allows to use enum in template
  ConstraintType = ConstraintType;

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
      this.teamGenerationService.generate(teams).then(generatedTeams => {

        this.teamService.saveTeams(generatedTeams);

        this.gotoDashboard();
      });
    });
  }

  onConstraintEnabledChanged(constraint: Constraint, enabled) {
    console.log('changed: enabled = ', enabled, constraint);
    // constraint.setEnabled(enabled);
  }

  onConstraintMinValueChanged(constraint: Constraint, value: number) {
    console.log('min value changed: ', value, constraint);
    constraint.setMinValue(value);
  }

  onConstraintMaxValueChanged(constraint: Constraint, value: number) {
    console.log('max value changed: ', value, constraint);
    constraint.setMaxValue(value);
  }

  gotoDashboard() {
    let link = ["/dashboard"];
    return this.router.navigate(link);
  }

}
