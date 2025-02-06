import { NgModule } from '@angular/core'

import { TabsModule } from 'ngx-bootstrap/tabs'

import { CommonModule } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { BadgeComponent, ButtonDirective, InputGroupComponent } from '@coreui/angular'
import { VoManagerRoutingModule } from './VoManager-routing.module'
import { VoOverviewComponent } from './VoOverviewComponent'
import { VoGuardService } from './vo-guard.service'
import { VoService } from '../api-connector/vo.service'
import { ResourcesComponent } from './resources/resources.component'
import { ProjectManagementModule } from '../projectmanagement/projectmanagement.module'
import { ClientOverviewComponent } from './clients/clientOverview.component'

import { NumberChartsComponent } from './number-charts/number-charts.component'
import { ClientLimitsComponent } from './clients/modals/client-limits..component'

import { MaintenanceComponent } from './maintenance/maintenance.component'
import { DatePickerComponent } from '../shared/datepicking/datepicker.component'
import { TimepickerComponent } from '../shared/datepicking/timepicker.component'
import { SharedModuleModule } from '../shared/shared_modules/shared-module.module'
import { TerminateProjectModalComponent } from './modals/terminate-project-modal/terminate-project-modal.component'
import { DeclineProjectTerminationModalComponent } from './modals/decline-project-termination-modal/decline-project-termination-modal.component'

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
		NgbTypeaheadModule,
		ReactiveFormsModule,
		NgbPaginationModule,
		DatePickerComponent,
		TimepickerComponent,
		SharedModuleModule,
		BadgeComponent,
		InputGroupComponent,
		ButtonDirective,
		VoOverviewComponent,
		ResourcesComponent,
		ClientOverviewComponent,
		NumberChartsComponent,
		ClientLimitsComponent,
		MaintenanceComponent,
		TerminateProjectModalComponent,
		DeclineProjectTerminationModalComponent
	],
	providers: [VoService, VoGuardService]
})
export class VoManagerModule {}
