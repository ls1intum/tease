import {Routes} from '@angular/router';
import {PersonListRoutes} from "./person-list/list/person-list.routes";
import {PersonDetailRoutes} from "./person-details/person-detail.routes";
import {PersonDataImporterRoutes} from "./person-data-importer/person-data-importer.routes";
import {TeamDashboardRoutes} from "./team-dashboard/dashboard/team-dashboard.routes";
import {TeamGenerationRoutes} from "./team-generation/team-generation.routes";

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'persons', pathMatch: 'full'},
  ...PersonDetailRoutes,
  ...PersonListRoutes,
  ...PersonDataImporterRoutes,
  ...TeamDashboardRoutes,
  ...TeamGenerationRoutes
];

