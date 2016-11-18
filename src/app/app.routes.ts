import {Routes} from '@angular/router';
import {PersonListRoutes} from "./person-list/person-list.routes";
import {PersonDetailRoutes} from "./person-details/person-detail.routes";
import {PersonDataImporterRoutes} from "./person-data-importer/person-data-importer.routes";

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'import', pathMatch: 'full'},
  ...PersonDetailRoutes,
  ...PersonListRoutes,
  ...PersonDataImporterRoutes
];

