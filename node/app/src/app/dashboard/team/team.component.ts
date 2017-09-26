import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Person} from '../../shared/models/person';
import {OverlayService} from '../../overlay.service';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input()
  protected team: Team;

  constructor(private overlayService: OverlayService) { }

  ngOnInit() {
  }


  protected showPersonDetails(person: Person) {
    this.overlayService.displayComponent(PersonDetailOverlayComponent, { person: person });
  }
}
