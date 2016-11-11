import { Routes } from '@angular/router';

import { HomeRoutes } from './home/index';
import {PersonDetailRoutes} from "./person-details/person-detail.routes";
import {PersonListRoutes} from "./person-list/person-list.routes";

export const routes: Routes = [
  ...HomeRoutes,
  ...PersonDetailRoutes,
  ...PersonListRoutes
];
