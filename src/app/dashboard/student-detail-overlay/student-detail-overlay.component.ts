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
    person: Student;
    onClose: () => void;
    onNextPersonClicked: () => void;
    onPreviousPersonClicked: () => void;
    onPersonClicked: (Person) => void;
  };

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  SkillLevel = SkillLevel;

  personSkillLevelFormGroup = new FormGroup({
    personSkillLevelControl: new FormControl(SkillLevel.None),
  });

  constructor() {}

  ngOnInit() {}

  personSkillLevelUpdated() {
    this.data.person.supervisorAssessment = this.personSkillLevelFormGroup.value.personSkillLevelControl;
  }

  isInTeam(person: Student): boolean {
    return person.team !== null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data) return;

    switch (event.key) {
      case '0':
        this.data.person.supervisorAssessment = SkillLevel.None;
        break;
      case '1':
        this.data.person.supervisorAssessment = SkillLevel.Low;
        break;
      case '2':
        this.data.person.supervisorAssessment = SkillLevel.Medium;
        break;
      case '3':
        this.data.person.supervisorAssessment = SkillLevel.High;
        break;
      case '4':
        this.data.person.supervisorAssessment = SkillLevel.VeryHigh;
        break;
    }

    if (!this.isInTeam(this.data.person)) {
      switch (event.key) {
        case 'ArrowLeft':
          this.data.onPreviousPersonClicked();
          break;
        case 'ArrowRight':
          this.data.onNextPersonClicked();
          break;
      }
    }

    event.preventDefault();
  }
}
