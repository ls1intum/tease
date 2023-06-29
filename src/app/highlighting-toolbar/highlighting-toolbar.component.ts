import { Component, OnInit } from '@angular/core';
import { StudentConstraintService } from '../shared/layers/business-logic-layer/student-constraint.service';
import { InstructorRatingStudentConstraint } from '../shared/models/student-constraints/instructor-rating-student-constraint';
import { DevicePossessionStudentConstraint } from '../shared/models/student-constraints/device-possession-student-constraint';
import { Skill} from '../shared/models/skill';
import { SkillLevel } from '../shared/models/generated-model/skillLevel';
import { CSVConstants } from '../shared/constants/csv.constants';
import { ExperienceStudentConstraint } from '../shared/models/student-constraints/experience-student-constraint';
import { Device } from '../shared/models/device';
import { GenderStudentConstraint } from '../shared/models/student-constraints/gender-student-constraint';
import { Gender } from '../shared/models/generated-model/gender';
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
    // TODO: instead of getting the skill names from the hardcoded CSV constants, retrieve them
    // from the parsed skills stored inside the team service (this component needs access to
    // the team service for that)

    // const pair = this.CSVConstants.Skills.SkillNameIdPairs.find(p => p[0] === skillName);
    // return pair ? pair[1] : skillName;

    return skillName; // return just the skill name for now
  }

  removeConstraint(studentConstraint: StudentConstraint) {
    StudentConstraintService.studentConstraints = StudentConstraintService.studentConstraints.filter(
      c => c !== studentConstraint
    );
  }
}
