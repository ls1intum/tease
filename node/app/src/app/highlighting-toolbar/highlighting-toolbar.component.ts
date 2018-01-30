import { Component, OnInit } from '@angular/core';
import {PersonConstraintService} from '../shared/layers/business-logic-layer/person-constraint.service';
import {InstructorRatingPersonConstraint} from '../shared/models/person-constraints/instructor-rating-person-constraint';
import {DevicePossessionPersonConstraint} from '../shared/models/person-constraints/device-possession-person-constraint';
import {Skill, SkillLevel} from '../shared/models/skill';
import {CSVConstants} from '../shared/constants/csv.constants';
import {ExperiencePersonConstraint} from '../shared/models/person-constraints/experience-person-constraint';
import {Device} from '../shared/models/device';
import {InterestPersonConstraint} from '../shared/models/person-constraints/interest-person-constraint';
import {GenderPersonConstraint} from '../shared/models/person-constraints/gender-person-constraint';
import {Gender} from '../shared/models/person';
import {PersonHighlightingOverlayComponent} from "../dashboard/person-highlighting-overlay/person-highlighting-overlay.component";
import {OverlayService} from "../overlay.service";

@Component({
  selector: 'app-highlighting-toolbar',
  templateUrl: './highlighting-toolbar.component.html',
  styleUrls: ['./highlighting-toolbar.component.scss']
})
export class HighlightingToolbarComponent implements OnInit {s;
  PersonConstraintService = PersonConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = Device;
  InstructorRatingPersonConstraint = InstructorRatingPersonConstraint;
  InterestPersonConstraint = InterestPersonConstraint;
  ExperiencePersonConstraint = ExperiencePersonConstraint;
  DevicePossessionPersonConstraint = DevicePossessionPersonConstraint;
  GenderPersonConstraint = GenderPersonConstraint;

  constructor(private overlayService: OverlayService) { }


  ngOnInit() {
  }

  showPersonHighlightingOverlay() {
    this.overlayService.displayComponent(PersonHighlightingOverlayComponent, {});
  }
}
