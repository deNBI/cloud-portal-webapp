import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

import { AddsimplevmComponent } from './addsimplevm.component';
import { AddcloudapplicationComponent } from './addcloudapplication.component';
import { TypeOverviewComponent } from './type-overview.component';
import { ValidationApplicationComponent } from '../validation-application/validation-application.component';

const routes: Routes = [
	{
		path: '',
		component: ApplicationsComponent,
		data: {
			title: 'Application overview',
		},

	},
	{
		path: 'newCloudApplication',
		component: AddcloudapplicationComponent,
		data: {
			title: 'New Application',
		},

	},
	{
		path: 'newSimpleVmApplication',
		component: AddsimplevmComponent,
		data: {
			title: 'New Application',
		},

	},
	{
		path: 'type-overview',
		component: TypeOverviewComponent,
		data: {
			title: 'Project Types Overview',
		},
	},
	{
		path: 'validation/:hash',
		component: ValidationApplicationComponent,
		data: {
			title: 'Application Validation',
		},
	},

];

/**
 * Application routing module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ApplicationsRoutingModule {
}
