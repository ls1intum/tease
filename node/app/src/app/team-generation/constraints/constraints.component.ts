import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangConstraints} from "../../shared/constants/language.constants";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {ConstraintType, Constraint} from "../../shared/models/constraints/constraint";
import {ConstraintService} from "../../shared/layers/business-logic-layer/constraint.service";
import {Team} from "../../shared/models/team";

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
  private teams: Team[];

  constructor(private router: Router,
              private teamGenerationService: TeamGenerationService,
              private toolbarService: ToolbarService,
              private teamService: TeamService,
              private constraintService: ConstraintService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangConstraints.ToolbarButtonName);
    this.constraintService.fetchConstraints().then(constraints => {
      this.constraints = constraints;
    });
    this.teamService.readSavedTeams().then(teams => {
      this.teams = teams.filter(team => {
        // filter out the 'orphan' team
        return team.name !== Team.OrphanTeamName;
      });
      // Add an anonymous team to the 'top' (index = 0) for global constraints
      this.teams.unshift(new Team(''));
    })
  }

  ngOnInit(): void {
    this.skipSubscription = this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoDashboard();
    });
  }

  ngOnDestroy(): void {
    this.constraintService.saveConstraints(this.constraints);
    this.skipSubscription.unsubscribe();
  }

  onGenerateClicked() {

    // Save constraints before running the algorithm
    this.constraintService.saveConstraints(this.constraints);

    // Prepare and launch the algorithm
    this.teamService.readSavedTeams().then(teams => {
      this.teamGenerationService.generate(teams).then(generatedTeams => {
        this.teamService.saveTeams(generatedTeams).then(saved => {
          this.gotoDashboard();
        });
      });
    });
  }

  onConstraintMinValueChanged(constraint: Constraint, value) {
    if (!isNaN(+value)) {
      console.log('min value changed:', constraint.getName(), +value, typeof +value);
      constraint.setMinValue(+value);
    }
  }

  onConstraintMaxValueChanged(constraint: Constraint, value) {
    if (!isNaN(+value)) {
      console.log('max value changed:', constraint.getName(), +value, typeof +value);
      constraint.setMaxValue(+value);
    }
  }

  gotoDashboard() {
    let link = ["/dashboard"];
    return this.router.navigate(link);
  }

}
