/**
 * Created by Malte Bucksch on 16/12/2016.
 */
import { Injectable, ViewContainerRef } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ToolbarService {
  private buttonNameSource = new Subject<string>();
  private buttonClickSource = new Subject<void>();

  buttonNameChanged = this.buttonNameSource.asObservable();
  buttonClicked = this.buttonClickSource.asObservable();

  constructor() {

  }

  changeButtonName(newName: string){
    this.buttonNameSource.next(newName);
  }

  onButtonClicked(){
    this.buttonClickSource.next();
  }
}
