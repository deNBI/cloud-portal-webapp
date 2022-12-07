import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoOverviewComponent } from './VoOverviewComponent';
import { VoGuardService } from './vo-guard.service';
import { ResourcesComponent } from './resources/resources.component';
import { ClientOverviewComponent } from './clients/clientOverview.component';
import { NumberChartsComponent } from './number-charts/number-charts.component';
import {MaintenanceComponent} from "./maintenance/maintenance.component";

const routes: Routes = [
	{
		path: 'overview',
		component: VoOverviewComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'Vo manager overview',
		},
	},
	{
		path: 'resources',
		component: ResourcesComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'Vo Resources',
		},

	},
	{
		path: 'clientsOverview',
		component: ClientOverviewComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'Clients',
		},

	},

	{
		path: 'numbers',
		component: NumberChartsComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'Cloud Numbers',
		},
	},

	{
		path: 'maintenance',
		component: MaintenanceComponent,
		canActivate: [VoGuardService],
		data: {
			title: 'Maintenance',
		},
	},

];

/**
 * Vo Manager routing module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class VoManagerRoutingModule {
}
