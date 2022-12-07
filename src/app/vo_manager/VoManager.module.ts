import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { VoManagerRoutingModule } from './VoManager-routing.module';
import { VoOverviewComponent } from './VoOverviewComponent';
import { VoGuardService } from './vo-guard.service';
import { VoService } from '../api-connector/vo.service';
import { ResourcesComponent } from './resources/resources.component';
import { ProjectManagementModule } from '../projectmanagement/projectmanagement.module';
import { ClientOverviewComponent } from './clients/clientOverview.component';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';
import { NumberChartsComponent } from './number-charts/number-charts.component';
import { ClientLimitsComponent } from './clients/modals/client-limits..component';
import { SharedDirectivesModule } from '../shared/shared_modules/shared_directives.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';

/**
 * VO Manager module.
 */
@NgModule({
	imports: [
		VoManagerRoutingModule,
		TabsModule,
		FormsModule,
		CommonModule,
		ModalModule.forRoot(),
		ProjectManagementModule,
		PipeModuleModule,
		NgbTypeaheadModule,
		ReactiveFormsModule,
		SharedDirectivesModule,
		NgbPaginationModule,
	],
	declarations: [
		VoOverviewComponent,
		ResourcesComponent,
		ClientOverviewComponent,
		NumberChartsComponent,
		ClientLimitsComponent,
		MaintenanceComponent,
	],
	providers: [VoService, VoGuardService],
})
export class VoManagerModule {}
