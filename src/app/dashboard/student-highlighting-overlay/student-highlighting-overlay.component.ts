import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';
import { StudentConstraintService } from '../../shared/layers/business-logic-layer/student-constraint.service';
import { InstructorRatingStudentConstraint } from '../../shared/models/student-constraints/instructor-rating-student-constraint';
import { StudentConstraint } from '../../shared/models/student-constraints/student-constraint';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { ExperienceStudentConstraint } from '../../shared/models/student-constraints/experience-student-constraint';
import { GenderStudentConstraint } from '../../shared/models/student-constraints/gender-student-constraint';
import { DevicePossessionStudentConstraint } from '../../shared/models/student-constraints/device-possession-student-constraint';
import { CSVConstants } from '../../shared/constants/csv.constants';
import { Gender } from '../../shared/models/student';
import { Device } from '../../shared/models/device';

@Component({
  selector: 'app-student-highlighting-overlay',
  templateUrl: './student-highlighting-overlay.component.html',
  styleUrls: ['./student-highlighting-overlay.component.scss'],
})
export class StudentHighlightingOverlayComponent implements OnInit, OverlayComponent {
  PersonConstraintService = StudentConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = Device;
  InstructorRatingPersonConstraint = InstructorRatingStudentConstraint;
  ExperiencePersonConstraint = ExperienceStudentConstraint;
  DevicePossessionPersonConstraint = DevicePossessionStudentConstraint;
  GenderPersonConstraint = GenderStudentConstraint;

  skillNames = CSVConstants.Skills.SkillNameAbbreviationPairs.map(pair => pair[0]);
  personConstraintsCopy: StudentConstraint[] = StudentConstraintService.personConstraints.map(c => c.copy());

  public data: any;
  console = console;

  dropdownVisible = false;

  constructor(private overlayService: OverlayService) {}

  ngOnInit() {}

  save() {
    StudentConstraintService.personConstraints = this.personConstraintsCopy;
    this.overlayService.closeOverlay();
  }

  addInstructorRatingConstraint() {
    this.personConstraintsCopy.push(new InstructorRatingStudentConstraint());
  }

  addExperienceConstraint() {
    const newConstraint = new ExperienceStudentConstraint();
    newConstraint.skillName = this.skillNames[0];
    this.personConstraintsCopy.push(newConstraint);
  }

  addGenderConstraint() {
    this.personConstraintsCopy.push(new GenderStudentConstraint());
  }

  addDeviceConstraint() {
    this.personConstraintsCopy.push(new DevicePossessionStudentConstraint());
  }

  removeConstraint(constraint: StudentConstraint) {
    this.personConstraintsCopy = this.personConstraintsCopy.filter(c => c !== constraint);
  }
}
