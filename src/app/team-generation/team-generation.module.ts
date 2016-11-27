import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {ConstraintsComponent} from "./constraints.component";
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [ConstraintsComponent],
  exports: [ConstraintsComponent],
  providers: []
})
export class TeamGenerationModule {

}
