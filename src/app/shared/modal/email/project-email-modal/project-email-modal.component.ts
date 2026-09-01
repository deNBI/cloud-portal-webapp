import { Component, EventEmitter, Input, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Application } from '../../../../applications/application.model/application.model'
import { EmailService } from '../../../../api-connector/email.service'
import { STATUS_LINK } from '../../../../../links/links'
import { NotificationModalComponent } from '../../notification-modal'
import { NgClass } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-project-email-modal',
	templateUrl: './project-email-modal.component.html',
	styleUrls: ['./projext-email-modal.component.scss'],
	providers: [EmailService],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [FormsModule, NgClass]
})
export class ProjectEmailModalComponent implements OnInit, OnDestroy {
	bsModalRef = inject(BsModalRef)
	private emailService = inject(EmailService)
	private notificationModal = inject(NotificationModalComponent)

	@Input() selectedProjects: Application[]

	emailAdminsOnly: boolean
	emailSubject: string
	emailReply: string
	emailText: string
	templates: string[]

	public event: EventEmitter<boolean> = new EventEmitter()

	ngOnInit() {
		this.getMailTemplates()
	}

	getMailTemplates(): void {
		this.emailService.getMailTemplates().subscribe((res: string[]) => {
			this.templates = res
		})
	}

	sentProjectsMail(): void {
		const project_ids = this.selectedProjects.map((pr: Application) => pr.project_application_perun_id)
		this.notificationModal.showInfoNotificationModal('Info', 'Sending Mails...')

		this.emailService
			.sendMailToProjects(project_ids, this.emailSubject, this.emailText, this.emailAdminsOnly, this.emailReply)
			.subscribe(
				() => {
					this.notificationModal.showSuccessFullNotificationModal('Success', 'Mails were successfully sent')
				},
				() => {
					this.notificationModal.showSuccessFullNotificationModal('Failed', 'Failed to send mails!')
				}
			)
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide()
	}

	protected readonly STATUS_LINK = STATUS_LINK
}
