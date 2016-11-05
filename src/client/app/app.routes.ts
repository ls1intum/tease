import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';
import {PersonDetailRoutes} from "./person-details/person-detail.routes";

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...PersonDetailRoutes
];
