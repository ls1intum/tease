 import {Routes} from '@angular/router';
import {PersonListRoutes} from "./person-list/list/person-list.routes";
import {PersonDataImporterRoutes} from "./person-data-importer/person-data-importer.routes";
import {TeamDashboardRoutes} from "./team-dashboard/dashboard/team-dashboard.routes";
import {TeamGenerationRoutes} from "./team-generation/team-generation.routes";
import {PersonDetailRoutes} from "./team-dashboard/person-details/person-detail.routes";

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'import', pathMatch: 'full'},
  ...PersonDetailRoutes,
  ...PersonListRoutes,
  ...PersonDataImporterRoutes,
  ...TeamDashboardRoutes,
  ...TeamGenerationRoutes,
];

