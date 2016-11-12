import {Routes} from "@angular/router";
import {PersonDetailComponent} from "./person-detail.component";

export const PersonDetailRoutes: Routes = [
  {path: 'detail/:id', component: PersonDetailComponent}
];
