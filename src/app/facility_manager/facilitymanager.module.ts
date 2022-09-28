import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FacilityProjectsOverviewComponent } from '../facility_manager/facilityprojectsoverview.component';
import { ImageTagComponent } from '../facility_manager/imagetags.component';
import { FacilitymanagerRoutingModule } from './facilitymanager-routing.module';
import { FacilityApplicationComponent } from './facility.application.component';
import { ResourcesComponent } from './resources/resources.component';
import { ApplicationsModule } from '../applications/applications.module';
import { NewsManagerComponent } from './newsmanagement/news-manager.component';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module';
import { ObjectstoragefactorOverviewComponent } from './resources/objectstoragefactor-overview/objectstoragefactor-overview.component';
import { VolumestoragefactorOverviewComponent } from './resources/volumestoragefactor-overview/volumestoragefactor-overview.component';
import { ResourcemachineOverviewComponent } from './resources/resourcemachine-overview/resourcemachine-overview.component';
import { GPUSpecificationOverviewComponent } from './resources/gpu-specification-overview/gpu-specification-overview.component';
import { GeneralstoragefactorOverviewComponent } from './resources/generalstoragefactor-overview/generalstoragefactor-overview.component';
import { ProjectManagementModule } from '../projectmanagement/projectmanagement.module';

/**
 * Facilitymanager module.
 */
@NgModule({
	imports: [
		FacilitymanagerRoutingModule,
		TabsModule,
		FormsModule,
		CommonModule,
		ModalModule.forRoot(),
		BsDatepickerModule.forRoot(),

		ApplicationsModule,
		ReactiveFormsModule,
		PipeModuleModule,
		SharedDirectivesModule,
		ProjectManagementModule,
		NgbTypeaheadModule,
		NgbPaginationModule,
	],
	declarations: [
		FacilityProjectsOverviewComponent,
		ImageTagComponent,
		FacilityApplicationComponent,
		ResourcesComponent,
		NewsManagerComponent,
		GeneralstoragefactorOverviewComponent,
		ObjectstoragefactorOverviewComponent,
		VolumestoragefactorOverviewComponent,
		ResourcemachineOverviewComponent,
		GPUSpecificationOverviewComponent,
		ResourcemachineOverviewComponent,
	],
})
export class FacilitymanagerModule {}
