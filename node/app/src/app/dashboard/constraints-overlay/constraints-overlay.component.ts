import {Component, OnDestroy, OnInit} from '@angular/core';
import {OverlayComponent, OverlayService} from '../../overlay.service';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';
import {Team} from "../../shared/models/team";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrls: ['./constraints-overlay.component.scss']
})
export class ConstraintsOverlayComponent implements OnInit, OnDestroy, OverlayComponent {
  public data: { onTeamsGenerated: (() => void), displayWarning: boolean };
  protected constraints: Constraint[];
  protected teams: Team[];

  constructor(private constraintService: ConstraintService,
              private teamGenerationService: TeamGenerationService,
              private teamService: TeamService,
              private overlayService: OverlayService) { }

  ngOnInit() {
    this.constraintService.fetchConstraints().then(constraints => {
      this.constraints = constraints;
    });

    this.teamService.readSavedTeams().then(teams => {
      this.teams = teams;
    });
  }

  ngOnDestroy(): void {
    this.constraintService.saveConstraints(this.constraints);
  }

  protected getGlobalConstraints(): Array<Constraint> {
    if (!this.constraints) return [];
    return this.constraints.filter(constraint => constraint.getTeamName() === Team.SpecialTeamNameForGlobalConstraints);
  }

  protected getConstraintsForTeam(team: Team): Array<Constraint> {
    if (!this.constraints) return [];
    return this.constraints.filter(constraint => constraint.getTeamName() === team.name);
  }

  protected getRealTeams(): Team[] {
    return !this.teams ? [] : this.teams.filter(team => team.name !== Team.OrphanTeamName);
  }

  protected applyConstraints() {
    this.constraintService.saveConstraints(this.constraints);

    this.teamGenerationService.generate(this.teams).then(generatedTeams => {
      this.teamService.saveTeams(generatedTeams).then(saved => {
        this.overlayService.closeOverlay();
        this.data.onTeamsGenerated();
      });
    });
  }
}
