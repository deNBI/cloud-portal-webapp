import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityProjectsOverviewComponent } from '../facility_manager/facilityprojectsoverview.component';
import { ImageTagComponent } from '../facility_manager/imagetags.component';
import { FacilityApplicationComponent } from './facility.application.component';
import { ResourcesComponent } from './resources/resources.component';
import { NewsManagerComponent } from './newsmanagement/news-manager.component';

const routes: Routes = [

	{
		path: 'facilityProjects',
		component: FacilityProjectsOverviewComponent,
		data: {
			title: 'Facility Projects',
		},

	},
	{
		path: 'imageTags',
		component: ImageTagComponent,
		data: {
			title: 'Image Tags',
		},
	},
	{
		path: 'facilityApplications',
		component: FacilityApplicationComponent,
		data: {
			title: 'Facility Applications',
		},
	},
	{
		path: 'facilityResources',
		component: ResourcesComponent,
		data: {
			title: 'Facility Resources',
		},
	},
	{
		path: 'news-manager',
		component: NewsManagerComponent,
		data: {
			title: 'News Management',
		},
	},

];

/**
 * Facilitymanager routing module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FacilitymanagerRoutingModule {
}
