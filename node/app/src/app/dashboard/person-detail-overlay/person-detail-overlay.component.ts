import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Person} from '../../shared/models/person';
import {Skill, SkillLevel} from '../../shared/models/skill';
import {Colors} from '../../shared/constants/color.constants';
import {Device} from '../../shared/models/device';
import {IconMapperService} from '../../shared/ui/icon-mapper.service';
import {OverlayComponent} from '../../overlay.service';
import {CSVConstants} from '../../shared/constants/csv.constants';
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";

@Component({
  selector: 'app-person-detail-overlay',
  templateUrl: './person-detail-overlay.component.html',
  styleUrls: ['./person-detail-overlay.component.scss']
})
export class PersonDetailOverlayComponent implements OnInit, OverlayComponent {
  public data: {
    person: Person,
    onClose: () => void,
    onNextPersonClicked: () => void,
    onPreviousPersonClicked: () => void,
    onPersonClicked: (Person) => void;
  };

  getLabelForSkillLevel = Skill.getLabelForSkillLevel;
  SkillLevel = SkillLevel;

  constructor() { }

  ngOnInit() {}

  filterSkills(skills: Skill[], skillLevel: number) {
    return skills.filter(function(skill) { return skill.skillLevel === skillLevel; });
  }

  range(count: number): number[] {
    return Array.apply(null, Array(count)).map(function (_, i) {return i; });
  }

  isInTeam(person: Person): boolean {
    return person.team !== null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data)
      return;

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
