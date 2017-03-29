import {Routes} from "@angular/router";
import {PersonDetailComponent} from "./details/person-detail.component";

export const PersonDetailRoutes: Routes = [
  {path: 'persons/:id',
    component: PersonDetailComponent}
];