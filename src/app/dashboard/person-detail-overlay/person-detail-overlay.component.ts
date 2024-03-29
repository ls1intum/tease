import { Component, HostListener } from '@angular/core';
import { Person } from '../../shared/models/person';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { OverlayComponent } from '../../overlay.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Team } from 'src/app/shared/models/team';

@Component({
  selector: 'app-person-detail-overlay',
  templateUrl: './person-detail-overlay.component.html',
  styleUrls: ['./person-detail-overlay.component.scss'],
})
export class PersonDetailOverlayComponent implements OverlayComponent {
  public data: {
    person: Person;
    team: Team;
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

  personSkillLevelUpdated() {
    this.data.person.supervisorRating = this.personSkillLevelFormGroup.value.personSkillLevelControl;
  }

  hasNoTeam(person: Person): boolean {
    return !person.teamName;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data) return;

    switch (event.key) {
      case '0':
        this.data.person.supervisorRating = SkillLevel.None;
        break;
      case '1':
        this.data.person.supervisorRating = SkillLevel.Low;
        break;
      case '2':
        this.data.person.supervisorRating = SkillLevel.Medium;
        break;
      case '3':
        this.data.person.supervisorRating = SkillLevel.High;
        break;
      case '4':
        this.data.person.supervisorRating = SkillLevel.VeryHigh;
        break;
    }

    if (this.hasNoTeam(this.data.person)) {
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
