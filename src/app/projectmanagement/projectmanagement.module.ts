import { NgModule } from '@angular/core'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { CommonModule } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule } from '@angular/forms'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { AlertModule } from 'ngx-bootstrap/alert'
import { NgSelectModule } from '@ng-select/ng-select'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { BadgeModule } from '@coreui/angular'
import { ApplicationsModule } from '../applications/applications.module'

import { ProjectOsDetailsComponent } from './project-os-details/project-os-details.component'

import { ProjectManagementRoutingModule } from './projectmanagement-routing.module'
import { OverviewComponent } from './overview.component'
import { ApplicationProgressComponent } from './application-progress/application-progress.component'
import { LifetimeRequestComponent } from './modals/lifetime-request/lifetime-request.component'
import { ModificationRequestComponent } from './modals/modification-request/modification-request.component'
import { CreditsRequestComponent } from './modals/credits-request/credits-request.component'
import { ExtensionEntryComponent } from './modals/testimonial/extension-entry.component'
import { ResultComponent } from './modals/result/result.component'
import { SharedModuleModule } from '../shared/shared_modules/shared-module.module'
import { AdjustLifetimeRequestComponent } from './modals/adjust-lifetime/adjust-lifetime-request.component'
import { AdjustApplicationComponent } from './modals/adjust-application/adjust-application.component'
import { WithdrawModalComponent } from './modals/withdraw/withdraw-modal.component'
import { TerminationRequestComponent } from './modals/termination-request/termination-request.component'
import { LeaveProjectComponent } from './modals/leave-project/leave-project.component'
import { DeleteApplicationModal } from './modals/delete-member-application-modal/delete-application-modal.component'
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component'
import { UserApplicationsModalComponent } from './modals/user-applications-modal/user-applications-modal.component'
import { ClipboardModule } from 'ngx-clipboard'

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
		BsDropdownModule,
		AlertModule,
		NgSelectModule,
		NgbModule,
		BadgeModule,
		SharedModuleModule,
		ClipboardModule,
		OverviewComponent,
		ProjectOsDetailsComponent,
		ApplicationProgressComponent,
		LifetimeRequestComponent,
		CreditsRequestComponent,
		ModificationRequestComponent,
		ResultComponent,
		ExtensionEntryComponent,
		AdjustLifetimeRequestComponent,
		AdjustApplicationComponent,
		WithdrawModalComponent,
		TerminationRequestComponent,
		LeaveProjectComponent,
		DeleteApplicationModal,
		AddUserModalComponent,
		UserApplicationsModalComponent
	],
	exports: [ProjectOsDetailsComponent, ExtensionEntryComponent]
})
export class ProjectManagementModule {}
