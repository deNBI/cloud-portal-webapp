import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal'
import { ProgressModule, ToastModule } from '@coreui/angular'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { RouterLink } from '@angular/router'
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component'
import { NotificationModalComponent } from '../modal/notification-modal'
import { InformationToastComponent } from '../toaster/information-toast.component'
import { ConfirmationModalComponent } from '../modal/confirmation-modal.component'
import { MigrationInformationComponent } from './migration-information/migration-information.component'
import { ApplicationBadgesComponent } from './components/applications/application-badges/application-badges.component'
import { ProjectEmailModalComponent } from '../modal/email/project-email-modal/project-email-modal.component'
import { TestimonialFormComponent } from './testimonial-forms/testimonial-form.component'
import { ApplicationListModalComponent } from '../modal/application-list/application-list.modal.component'
import { MaintenanceNotificationComponent } from './components/maintenance-notification/maintenance-notification.component'

import { MembersListModalComponent } from '../modal/members/members-list-modal.component'
import { ProjectCsvTemplatedEmailModalComponent } from '../modal/email/project-csv-templated-email-modal/project-csv-templated-email-modal.component'
import { ViewPublicKeyComponent } from '../modal/view-public-key/view-public-key.component'
import { ClipboardModule } from 'ngx-clipboard'

/**
 * Shared module.
 */
@NgModule({
	exports: [
		ApplicationBaseClassComponent,
		NotificationModalComponent,
		MembersListModalComponent,
		ApplicationListModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		ProjectCsvTemplatedEmailModalComponent,
		TestimonialFormComponent,
		MaintenanceNotificationComponent,
		ViewPublicKeyComponent
	],
	imports: [
		CommonModule,
		ModalModule.forRoot(),
		ToastModule,
		ProgressModule,
		FormsModule,
		NgSelectModule,
		ReactiveFormsModule,
		RouterLink,
		ClipboardModule,
		ApplicationBaseClassComponent,
		MembersListModalComponent,
		ApplicationListModalComponent,
		NotificationModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		ProjectCsvTemplatedEmailModalComponent,
		TestimonialFormComponent,
		MaintenanceNotificationComponent,
		ViewPublicKeyComponent
	]
})
export class SharedModuleModule {}
