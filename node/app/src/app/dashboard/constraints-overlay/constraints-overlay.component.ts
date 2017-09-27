import { Component, OnInit } from '@angular/core';
import {OverlayComponent} from '../../overlay.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrls: ['./constraints-overlay.component.scss']
})
export class ConstraintsOverlayComponent implements OnInit, OverlayComponent {
  public data: {};

  constructor() { }

  ngOnInit() {
  }

}
