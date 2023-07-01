import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';
import { StudentConstraintService } from '../../shared/layers/business-logic-layer/student-constraint.service';
import { InstructorRatingStudentConstraint } from '../../shared/models/student-constraints/instructor-rating-student-constraint';
import { StudentConstraint } from '../../shared/models/student-constraints/student-constraint';
import { Skill } from '../../shared/models/skill';
import { SkillLevel } from 'src/app/shared/models/generated-model/skillLevel';
import { ExperienceStudentConstraint } from '../../shared/models/student-constraints/experience-student-constraint';
import { GenderStudentConstraint } from '../../shared/models/student-constraints/gender-student-constraint';
import { DevicePossessionStudentConstraint } from '../../shared/models/student-constraints/device-possession-student-constraint';
import { CSVConstants } from '../../shared/constants/csv.constants';
import { Gender } from '../../shared/models/generated-model/gender';
import { DeviceType } from '../../shared/models/generated-model/device';

@Component({
  selector: 'app-student-highlighting-overlay',
  templateUrl: './student-highlighting-overlay.component.html',
  styleUrls: ['./student-highlighting-overlay.component.scss'],
})
export class StudentHighlightingOverlayComponent implements OnInit, OverlayComponent {
  StudentConstraintService = StudentConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = DeviceType;
  InstructorRatingStudentConstraint = InstructorRatingStudentConstraint;
  ExperienceStudentConstraint = ExperienceStudentConstraint;
  DevicePossessionStudentConstraint = DevicePossessionStudentConstraint;
  GenderStudentConstraint = GenderStudentConstraint;

  // TODO: instead of getting the skill names from the hardcoded CSV constants, retrieve them
  // from the parsed skills stored inside the team service (this component needs access to the team service for that)
  // empty for nwo
  skillNames = []
  // skillNames = [CSVConstants.Skills.SkillNameIdPairs.map(pair => pair[0])];
  studentConstraintsCopy: StudentConstraint[] = StudentConstraintService.studentConstraints.map(c => c.copy());

  public data: any;
  console = console;

  dropdownVisible = false;

  constructor(private overlayService: OverlayService) {}

  ngOnInit() {}

  save() {
    StudentConstraintService.studentConstraints = this.studentConstraintsCopy;
    this.overlayService.closeOverlay();
  }

  addInstructorRatingConstraint() {
    this.studentConstraintsCopy.push(new InstructorRatingStudentConstraint());
  }

  addExperienceConstraint() {
    const newConstraint = new ExperienceStudentConstraint();
    newConstraint.skillTitle = this.skillNames[0];
    this.studentConstraintsCopy.push(newConstraint);
  }

  addGenderConstraint() {
    this.studentConstraintsCopy.push(new GenderStudentConstraint());
  }

  addDeviceConstraint() {
    this.studentConstraintsCopy.push(new DevicePossessionStudentConstraint());
  }

  removeConstraint(constraint: StudentConstraint) {
    this.studentConstraintsCopy = this.studentConstraintsCopy.filter(c => c !== constraint);
  }
}
