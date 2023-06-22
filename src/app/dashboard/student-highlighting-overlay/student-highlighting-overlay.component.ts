import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';
import { PersonConstraintService } from '../../shared/layers/business-logic-layer/person-constraint.service';
import { InstructorRatingPersonConstraint } from '../../shared/models/person-constraints/instructor-rating-person-constraint';
import { PersonConstraint } from '../../shared/models/person-constraints/person-constraint';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { ExperiencePersonConstraint } from '../../shared/models/person-constraints/experience-person-constraint';
import { GenderPersonConstraint } from '../../shared/models/person-constraints/gender-person-constraint';
import { DevicePossessionPersonConstraint } from '../../shared/models/person-constraints/device-possession-person-constraint';
import { CSVConstants } from '../../shared/constants/csv.constants';
import { Gender } from '../../shared/models/person';
import { Device } from '../../shared/models/device';

@Component({
  selector: 'app-student-highlighting-overlay',
  templateUrl: './student-highlighting-overlay.component.html',
  styleUrls: ['./student-highlighting-overlay.component.scss'],
})
export class StudentHighlightingOverlayComponent implements OnInit, OverlayComponent {
  PersonConstraintService = PersonConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = Device;
  InstructorRatingPersonConstraint = InstructorRatingPersonConstraint;
  ExperiencePersonConstraint = ExperiencePersonConstraint;
  DevicePossessionPersonConstraint = DevicePossessionPersonConstraint;
  GenderPersonConstraint = GenderPersonConstraint;

  skillNames = CSVConstants.Skills.SkillNameAbbreviationPairs.map(pair => pair[0]);
  personConstraintsCopy: PersonConstraint[] = PersonConstraintService.personConstraints.map(c => c.copy());

  public data: any;
  console = console;

  dropdownVisible = false;

  constructor(private overlayService: OverlayService) {}

  ngOnInit() {}

  save() {
    PersonConstraintService.personConstraints = this.personConstraintsCopy;
    this.overlayService.closeOverlay();
  }

  addInstructorRatingConstraint() {
    this.personConstraintsCopy.push(new InstructorRatingPersonConstraint());
  }

  addExperienceConstraint() {
    const newConstraint = new ExperiencePersonConstraint();
    newConstraint.skillName = this.skillNames[0];
    this.personConstraintsCopy.push(newConstraint);
  }

  addGenderConstraint() {
    this.personConstraintsCopy.push(new GenderPersonConstraint());
  }

  addDeviceConstraint() {
    this.personConstraintsCopy.push(new DevicePossessionPersonConstraint());
  }

  removeConstraint(constraint: PersonConstraint) {
    this.personConstraintsCopy = this.personConstraintsCopy.filter(c => c !== constraint);
  }
}
