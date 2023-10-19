import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro-card',
  templateUrl: './intro-card.component.html',
  styleUrls: ['./intro-card.component.scss'],
})
export class IntroCardComponent {
  @Output() importPressed = new EventEmitter();
}
