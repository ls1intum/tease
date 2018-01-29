import { Component, OnInit } from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {PersonConstraintService} from '../../shared/layers/business-logic-layer/person-constraint.service';
import {InstructorRatingPersonConstraint} from '../../shared/models/person-constraints/instructor-rating-person-constraint';
import {PersonConstraint} from '../../shared/models/person-constraints/person-constraint';
import {Skill, SkillLevel} from '../../shared/models/skill';
import {InterestPersonConstraint} from '../../shared/models/person-constraints/interest-person-constraint';
import {ExperiencePersonConstraint} from '../../shared/models/person-constraints/experience-person-constraint';
import {GenderPersonConstraint} from '../../shared/models/person-constraints/gender-person-constraint';
import {DevicePossessionPersonConstraint} from '../../shared/models/person-constraints/device-possession-person-constraint';
import {CSVConstants} from '../../shared/constants/csv.constants';
import {Gender} from '../../shared/models/person';
import {Device} from "../../shared/models/device";

@Component({
  selector: 'app-person-highlighting-overlay',
  templateUrl: './person-highlighting-overlay.component.html',
  styleUrls: ['./person-highlighting-overlay.component.scss']
})
export class PersonHighlightingOverlayComponent implements OnInit, OverlayComponent {
  PersonConstraintService = PersonConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = Device;

  skillNames = CSVConstants.Skills.SkillNameAbbreviationPairs.map(pair => pair[0]);

  public data: any;
  console = console;

  dropdownVisible = false;

  constructor() { }

  ngOnInit() {
  }

  cancel() {

  }

  save() {

  }

  addInstructorRatingConstraint() {
    PersonConstraintService.personConstraints.push(new InstructorRatingPersonConstraint());
  }

  addInterestLevelConstraint() {
    PersonConstraintService.personConstraints.push(new InterestPersonConstraint());
  }

  addExperienceConstraint() {
    PersonConstraintService.personConstraints.push(new ExperiencePersonConstraint());
  }

  addGenderConstraint() {
    PersonConstraintService.personConstraints.push(new GenderPersonConstraint());
  }

  addDeviceConstraint() {
    PersonConstraintService.personConstraints.push(new DevicePossessionPersonConstraint());
  }

  getIntructorRatingConstraint(personConstraint: PersonConstraint): PersonConstraint {
    if (personConstraint instanceof  InstructorRatingPersonConstraint)
      return personConstraint;

    return null;
  }

  getInterestPersonConstraint(personConstraint: PersonConstraint) {
    if (personConstraint instanceof InterestPersonConstraint)
      return personConstraint;

    return null;
  }

  getExperiencePersonConstraint(personConstraint: PersonConstraint) {
    if (personConstraint instanceof ExperiencePersonConstraint)
      return personConstraint;

    return null;
  }

  getGenderPersonConstraint(personConstraint: PersonConstraint) {
    if (personConstraint instanceof GenderPersonConstraint)
      return personConstraint;

    return null;
  }

  getDevicePossessionPersonConstraint(personConstraint: PersonConstraint) {
    if (personConstraint instanceof DevicePossessionPersonConstraint)
      return personConstraint;

    return null;
  }

  removeConstraint(constraint: PersonConstraint) {
    PersonConstraintService.personConstraints = PersonConstraintService.personConstraints.filter(c => c !== constraint);
  }
}
