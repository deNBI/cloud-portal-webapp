import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterLink } from '@angular/router';
import { ApplicationBaseClassComponent } from './baseClass/application-base-class.component';
import { NotificationModalComponent } from '../modal/notification-modal';
import { InformationToastComponent } from '../toaster/information-toast.component';
import { ConfirmationModalComponent } from '../modal/confirmation-modal.component';
import { MigrationInformationComponent } from './migration-information/migration-information.component';
import { ApplicationBadgesComponent } from './components/applications/application-badges/application-badges.component';
import { ProjectEmailModalComponent } from '../modal/email/project-email-modal/project-email-modal.component';
import { TestimonialFormComponent } from './testimonial-forms/testimonial-form.component';
import { SharedDirectivesModule } from './shared_directives.module';
import { MaintenanceNotificationComponent } from './components/maintenance-notification/maintenance-notification.component';
import { PipeModuleModule } from '../../pipe-module/pipe-module.module';
import { MembersListModalComponent } from '../modal/members/members-list-modal.component';
import {
	ProjectCsvTemplatedEmailModalComponent,
} from '../modal/email/project-csv-templated-email-modal/project-csv-templated-email-modal.component';

/**
 * Shared module.
 */
@NgModule({
	exports: [
		ApplicationBaseClassComponent,
		NotificationModalComponent,
		MembersListModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		ProjectCsvTemplatedEmailModalComponent,
		TestimonialFormComponent,
		MaintenanceNotificationComponent,
	],
	imports: [
		CommonModule,
		ModalModule.forRoot(),
		ToastModule,
		ProgressModule,
		FormsModule,
		PipeModuleModule,
		NgSelectModule,
		SharedDirectivesModule,
		ReactiveFormsModule,
		RouterLink,
	],
	declarations: [
		ApplicationBaseClassComponent,
		MembersListModalComponent,
		NotificationModalComponent,
		ConfirmationModalComponent,
		InformationToastComponent,
		MigrationInformationComponent,
		ApplicationBadgesComponent,
		ProjectEmailModalComponent,
		ProjectCsvTemplatedEmailModalComponent,
		TestimonialFormComponent,
		MaintenanceNotificationComponent,
	],
})
export class SharedModuleModule {}
