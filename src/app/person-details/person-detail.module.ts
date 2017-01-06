
import {NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PersonDetailComponent} from "./details/person-detail.component";
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "@angular/material";
import {DevicesComponent} from "./devices/devices.component";
import {IconMapperService} from "../shared/ui/icon-mapper.service";
import {PrioritiesComponent} from "./priorities/priorities.component";
import {SkillsComponent} from "./skills/skills.component";
@NgModule({
  imports: [CommonModule, SharedModule,  MaterialModule],
  declarations: [PersonDetailComponent,DevicesComponent,PrioritiesComponent,SkillsComponent],
  exports: [PersonDetailComponent,DevicesComponent],
  providers: [IconMapperService]
})
export class PersonDetailModule { }
