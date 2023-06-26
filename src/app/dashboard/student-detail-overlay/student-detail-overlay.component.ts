import { Component, HostListener, OnInit } from '@angular/core';
import { Student } from '../../shared/models/student';
import { Skill, SkillLevel } from '../../shared/models/skill';
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

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  SkillLevel = SkillLevel;

  studentSkillLevelFormGroup = new FormGroup({
    studentSkillLevelControl: new FormControl(SkillLevel.None),
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
      case '0':
        this.data.student.supervisorAssessment = SkillLevel.None;
        break;
      case '1':
        this.data.student.supervisorAssessment = SkillLevel.Low;
        break;
      case '2':
        this.data.student.supervisorAssessment = SkillLevel.Medium;
        break;
      case '3':
        this.data.student.supervisorAssessment = SkillLevel.High;
        break;
      case '4':
        this.data.student.supervisorAssessment = SkillLevel.VeryHigh;
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
