import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApplicationsModule } from '../applications/applications.module';
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module';
import { ProjectOsDetailsComponent } from './project-os-details/project-os-details.component';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';
import { ProjectManagementRoutingModule } from './projectmanagement-routing.module';
import { OverviewComponent } from './overview.component';
import { ApplicationProgressComponent } from './application-progress/application-progress.component';
import { LifetimeRequestComponent } from './modals/lifetime-request/lifetime-request.component';
import { ModificationRequestComponent } from './modals/modification-request/modification-request.component';
import { CreditsRequestComponent } from './modals/credits-request/credits-request.component';
import { DoiComponent } from './modals/doi/doi.component';
import { ResultComponent } from './modals/result/result.component';

/**
 * Projectmanagment module.
 */
@NgModule({
	imports: [
		AccordionModule.forRoot(),
		ProjectManagementRoutingModule,
		TabsModule,
		FormsModule,
		CommonModule,
		ModalModule.forRoot(),
		ApplicationsModule,
		SharedDirectivesModule,
		NgChartsModule,
		PipeModuleModule,
		BsDropdownModule,
		AlertModule,
		NgSelectModule,
	],
	declarations: [
		OverviewComponent,
		ProjectOsDetailsComponent,
		ApplicationProgressComponent,
		LifetimeRequestComponent,
		CreditsRequestComponent,
		ModificationRequestComponent,
		DoiComponent,
		ResultComponent,
	],
	exports: [
		ProjectOsDetailsComponent,
	],
})
export class ProjectManagementModule {
}
