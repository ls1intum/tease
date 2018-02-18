import {Component, OnDestroy, OnInit} from '@angular/core';
import {OverlayComponent, OverlayService} from '../../overlay.service';
import {Constraint} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';
import {Team} from '../../shared/models/team';
import {TeamGenerationService} from '../../shared/layers/business-logic-layer/team-generation/team-generation.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrls: ['./constraints-overlay.component.scss']
})
export class ConstraintsOverlayComponent implements OnInit, OnDestroy, OverlayComponent {
  private static readonly noFeasibleSolutionHintTimeout = 2000;

  public data: { displayWarning: boolean };
  protected constraints: Constraint[];
  protected teamsWithVisibleConstraints: Team[] = [];
  noFeasibleSolutionHintShown = false;
  protected noFeasibleSolutionHintTimeoutHandle = null;

  constructor(private constraintService: ConstraintService,
              private teamGenerationService: TeamGenerationService,
              public teamService: TeamService,
              private overlayService: OverlayService) { }

  ngOnInit() {
    this.constraintService.fetchConstraints().then(constraints => {
      this.constraints = constraints;
    });
  }

  ngOnDestroy(): void {
    this.constraintService.saveConstraints(this.constraints);
  }

  public getGlobalConstraints(): Array<Constraint> {
    if (!this.constraints) return [];
    return this.constraints.filter(constraint => {
      return constraint.getTeamName() === null;
    });
  }

  protected getConstraintsForTeam(team: Team): Array<Constraint> {
    if (!this.constraints) return [];
    return this.constraints.filter(constraint => constraint.getTeamName() === team.name);
  }

  public applyConstraints() {
    this.constraintService.saveConstraints(this.constraints);
    this.teamService.resetUnpinnedPersons();

    this.teamGenerationService.generate(this.teamService.persons, this.teamService.teams).then(feasible => {
      if (!feasible) {
        clearTimeout(this.noFeasibleSolutionHintTimeoutHandle);
        this.noFeasibleSolutionHintShown = true;

        this.noFeasibleSolutionHintTimeoutHandle =
          setTimeout(() => this.noFeasibleSolutionHintShown = false,
            ConstraintsOverlayComponent.noFeasibleSolutionHintTimeout);
        return;
      }

      // this.teamService.updateReverseReferences();
      this.teamService.updateDerivedProperties();
      this.overlayService.closeOverlay();
      this.teamService.saveToLocalBrowserStorage();
    });
  }

  public toggleTeamConstraintVisibility(team: Team) {
    const indexOfTeam = this.teamsWithVisibleConstraints.indexOf(team);
    if (indexOfTeam !== -1) {
      this.teamsWithVisibleConstraints.splice(indexOfTeam, 1);
    } else {
      this.teamsWithVisibleConstraints.push(team);
    }
  }

  public areConstraintsForTeamVisible(team: Team): boolean {
    return this.teamsWithVisibleConstraints.includes(team);
  }

  public hasActiveConstraints(team) {
    return this.getConstraintsForTeam(team).reduce((acc, constraint, index, array) => acc || constraint.isEnabled, false);
  }

  hasWarnings(): boolean {
    return this.constraints ? this.constraints.reduce((acc, constraint) => acc || constraint.hasWarnings(), false) : false;
  }
}
