import { Component, OnInit } from '@angular/core';
import { StudentConstraintService } from '../shared/layers/business-logic-layer/student-constraint.service';
import { InstructorRatingStudentConstraint } from '../shared/models/student-constraints/instructor-rating-student-constraint';
import { DevicePossessionStudentConstraint } from '../shared/models/student-constraints/device-possession-student-constraint';
import { Skill, SkillLevel } from '../shared/models/skill';
import { CSVConstants } from '../shared/constants/csv.constants';
import { ExperienceStudentConstraint } from '../shared/models/student-constraints/experience-student-constraint';
import { Device } from '../shared/models/device';
import { GenderStudentConstraint } from '../shared/models/student-constraints/gender-student-constraint';
import { Gender } from '../shared/models/student';
import { StudentHighlightingOverlayComponent } from '../dashboard/student-highlighting-overlay/student-highlighting-overlay.component';
import { OverlayService } from '../overlay.service';
import { StudentConstraint } from '../shared/models/student-constraints/student-constraint';

@Component({
  selector: 'app-highlighting-toolbar',
  templateUrl: './highlighting-toolbar.component.html',
  styleUrls: ['./highlighting-toolbar.component.scss'],
})
export class HighlightingToolbarComponent implements OnInit {
  s;
  StudentConstraintService = StudentConstraintService;
  SkillLevel = SkillLevel;
  Skill = Skill;
  CSVConstants = CSVConstants;
  Gender = Gender;
  Device = Device;
  InstructorRatingStudentConstraint = InstructorRatingStudentConstraint;
  ExperienceStudentConstraint = ExperienceStudentConstraint;
  DevicePossessionStudentConstraint = DevicePossessionStudentConstraint;
  GenderStudentConstraint = GenderStudentConstraint;

  constructor(private overlayService: OverlayService) {}

  ngOnInit() {}

  showStudentHighlightingOverlay() {
    this.overlayService.displayComponent(StudentHighlightingOverlayComponent, {});
  }

  getSkillNameAbbreviation(skillName: string) {
    const pair = this.CSVConstants.Skills.SkillNameAbbreviationPairs.find(p => p[0] === skillName);
    return pair ? pair[1] : skillName;
  }

  removeConstraint(studentConstraint: StudentConstraint) {
    StudentConstraintService.studentConstraints = StudentConstraintService.studentConstraints.filter(
      c => c !== studentConstraint
    );
  }
}
