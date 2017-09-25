import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input()
  protected team: Team;

  constructor() { }

  ngOnInit() {
  }

}
