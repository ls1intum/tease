import { Component, OnInit } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { ConstraintsService } from '../../shared/data/constraints.service';
import { ConstraintWrapper } from '../../shared/matching/constraints/constraint';
import { MatchingService } from 'src/app/shared/matching/matching.service';
import { StudentsService } from 'src/app/shared/data/students.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrl: './constraints-overlay.component.css',
})
export class ConstraintsOverlayComponent implements OverlayComponent, OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  constructor(
    private constraintsService: ConstraintsService,
    private matchingService: MatchingService,
    private studentsService: StudentsService
  ) {}

  constraints: ConstraintWrapper[];

  ngOnInit() {
    this.constraints = this.constraintsService.getConstraints();
  }

  distributeTeams() {
    const constraints = this.constraints.flatMap(constraint => constraint.constraint);
    this.matchingService.getMatching(constraints, this.studentsService.getStudents());
  }
}
