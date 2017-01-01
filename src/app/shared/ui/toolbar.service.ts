/**
 * Created by Malte Bucksch on 16/12/2016.
 */
import { Injectable, ViewContainerRef } from '@angular/core';
import {Subject} from "rxjs";
import {LangDefaults} from "../constants/language.constants";

@Injectable()
export class ToolbarService {
  private buttonNameSource = new Subject<string>();
  private buttonVisibilitySource = new Subject<boolean>();
  private buttonClickSource = new Subject<void>();

  buttonNameChanged = this.buttonNameSource.asObservable();
  buttonClicked = this.buttonClickSource.asObservable();
  buttonVisibilityChanged = this.buttonVisibilitySource.asObservable();

  constructor() {

  }

  resetToDefaultValues(){
    this.buttonNameSource.next(LangDefaults.ToolbarButtonName);
    this.buttonVisibilitySource.next(LangDefaults.ToolbarButtonIsVisible);
  }

  setButtonVisibility(isVisible: boolean){
    this.buttonVisibilitySource.next(isVisible);
  }

  changeButtonName(newName: string){
    this.buttonNameSource.next(newName);
  }

  onButtonClicked(){
    this.buttonClickSource.next();
  }
}
