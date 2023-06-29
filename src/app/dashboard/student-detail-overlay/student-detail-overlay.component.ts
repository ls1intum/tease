import { Component, HostListener, OnInit } from '@angular/core';
import { Student } from '../../shared/models/student';
import { Skill } from '../../shared/models/skill';
import { SkillLevel } from '../../shared/models/generated-model/skillLevel';
import { OverlayComponent } from '../../overlay.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student-detail-overlay',
  templateUrl: './student-detail-overlay.component.html',
  styleUrls: ['./student-detail-overlay.component.scss'],
})
export class StudentDetailOverlayComponent implements OnInit, OverlayComponent {
  public data: {
    student: Student;
    onClose: () => void;
    onNextStudentClicked: () => void;
    onPreviousStudentClicked: () => void;
    onStudentClicked: (Student) => void;
  };

  SkillLevel = SkillLevel;

  studentSkillLevelFormGroup = new FormGroup({
    studentSkillLevelControl: new FormControl(SkillLevel.Novice),
  });

  constructor() {}

  ngOnInit() {}

  studentSkillLevelUpdated() {
    this.data.student.supervisorAssessment = this.studentSkillLevelFormGroup.value.studentSkillLevelControl;
  }

  isInTeam(student: Student): boolean {
    return student.team !== null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data) return;

    switch (event.key) {
      case '1':
        this.data.student.supervisorAssessment = SkillLevel.Novice;
        break;
      case '2':
        this.data.student.supervisorAssessment = SkillLevel.Intermediate;
        break;
      case '3':
        this.data.student.supervisorAssessment = SkillLevel.Advanced;
        break;
      case '4':
        this.data.student.supervisorAssessment = SkillLevel.Expert;
        break;
    }

    if (!this.isInTeam(this.data.student)) {
      switch (event.key) {
        case 'ArrowLeft':
          this.data.onPreviousStudentClicked();
          break;
        case 'ArrowRight':
          this.data.onNextStudentClicked();
          break;
      }
    }

    event.preventDefault();
  }
}
