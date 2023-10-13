import { Component, OnDestroy, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';
import { Constraint } from '../../shared/models/constraints/constraint';
import { ConstraintService } from '../../shared/layers/business-logic-layer/constraint.service';
import { TeamGenerationService } from '../../shared/layers/business-logic-layer/team-generation/team-generation.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { ConstraintLoggingService } from '../../shared/layers/business-logic-layer/constraint-logging.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrls: ['./constraints-overlay.component.scss'],
})
export class ConstraintsOverlayComponent implements OnInit, OnDestroy, OverlayComponent {
  private static readonly noFeasibleSolutionHintTimeout = 2000;

  public data: { displayWarning: boolean };
  protected constraints: Constraint[];
  noFeasibleSolutionHintShown = false;
  protected noFeasibleSolutionHintTimeoutHandle = null;
  globalConstraints: Constraint[];
  teamConstraints: Record<string, Constraint[]>;

  constructor(
    private constraintService: ConstraintService,
    private teamGenerationService: TeamGenerationService,
    public teamService: TeamService,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    this.constraintService.fetchConstraints().then(constraints => {
      this.constraints = constraints;
      this.globalConstraints = this.getGlobalConstraints();
      this.teamConstraints = this.groupByTeam(this.constraints);
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
  public applyConstraints() {
    this.constraintService.saveConstraints(this.constraints);
    this.teamService.resetUnpinnedPersons();

    this.teamGenerationService.generate(this.teamService.persons, this.teamService.teams).then(feasible => {
      if (!feasible) {
        clearTimeout(this.noFeasibleSolutionHintTimeoutHandle);
        this.noFeasibleSolutionHintShown = true;

        this.noFeasibleSolutionHintTimeoutHandle = setTimeout(
          () => (this.noFeasibleSolutionHintShown = false),
          ConstraintsOverlayComponent.noFeasibleSolutionHintTimeout
        );
        return;
      }

      this.logConstraints();
      this.teamService.updateDerivedProperties();
      this.overlayService.closeOverlay();
      this.teamService.saveToLocalBrowserStorage();
    });
  }

  private logConstraints() {
    const loggedMessage: string[] = [];

    loggedMessage.push(new Date().toUTCString() + ' - Persons distributed with constraints:');
    loggedMessage.push(
      ...this.constraints.filter(constraint => constraint.isEnabled).map(constraint => constraint.toString())
    );

    ConstraintLoggingService.pushMessage(loggedMessage.join('\r\n'));
  }

  hasActiveConstraints(constraints: Constraint[]) {
    return constraints.reduce((acc, constraint) => acc || constraint.isEnabled, false);
  }
  hasTabWarnings(constraints: Constraint[]): boolean {
    return constraints ? constraints.reduce((acc, constraint) => acc || constraint.hasWarnings(), false) : false;
  }
  hasWarnings(): boolean {
    return this.constraints
      ? this.constraints.reduce((acc, constraint) => acc || constraint.hasWarnings(), false)
      : false;
  }
  groupByTeam(constraints: Constraint[]) {
    const result = constraints.reduce(function (previous, current) {
      previous[current.teamName] = previous[current.teamName] || [];
      previous[current.teamName].push(current);
      return previous;
    }, Object.create(null));
    return result;
  }
}
