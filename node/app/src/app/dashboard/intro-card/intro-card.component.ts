import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-intro-card',
  templateUrl: './intro-card.component.html',
  styleUrls: ['./intro-card.component.scss']
})
export class IntroCardComponent implements OnInit {
  @Output() onImportPressed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}
