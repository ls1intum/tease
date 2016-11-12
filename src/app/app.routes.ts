import {Routes} from '@angular/router';
import {PersonListRoutes} from "./person-list/person-list.routes";
import {PersonDetailRoutes} from "./person-details/person-detail.routes";

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'persons', pathMatch: 'full'},
  ...PersonDetailRoutes,
  ...PersonListRoutes
];

