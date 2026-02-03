import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Application } from '../../../../applications/application.model/application.model'
import { EmailService } from '../../../../api-connector/email.service'
import { STATUS_LINK } from '../../../../../links/links'
import { CsvMailTemplateModel } from '../../../classes/csvMailTemplate.model'
import { NotificationModalComponent } from '../../notification-modal'
import { NgClass } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-project-csv-templated-email-modal',
	templateUrl: './project-csv-templated-email-modal.component.html',
	styleUrls: ['./project-csv-templated-email.scss'],
	providers: [EmailService],
	imports: [FormsModule, NgClass]
})
export class ProjectCsvTemplatedEmailModalComponent implements OnInit, OnDestroy {
	csvMailTemplate: CsvMailTemplateModel
	csvFile: File

	emailAdminsOnly: boolean
	emailSubject: string
	emailReply: string
	emailText: string
	templates: string[]
	validCSVExample = `Project, VM, LOCATION
Proj1, VM_1, Bielefeld
Proj2, VM_2, Giessen`

	public event: EventEmitter<boolean> = new EventEmitter()

	constructor(
		public bsModalRef: BsModalRef,
		private emailService: EmailService,
		private notificationModal: NotificationModalComponent
	) {}

	ngOnInit() {
		this.getMailTemplates()
	}

	onCsvFileSelected(event): void {
		const inputElement = event.target as HTMLInputElement
		this.csvFile = inputElement.files[0]
		if (this.csvFile) {
			this.emailService.sendCsvTemplate(this.csvFile).subscribe(
				(csvTemplate: CsvMailTemplateModel) => {
					this.csvMailTemplate = csvTemplate
				},
				(error: CsvMailTemplateModel) => {
					this.csvMailTemplate = error
					console.log(error['error'])
				}
			)
		}
	}

	getMailTemplates(): void {
		this.emailService.getMailTemplates().subscribe((res: string[]) => {
			this.templates = res
		})
	}

	sentProjectsTemplatedMail(): void {
		const project_ids = this.csvMailTemplate.valid_projects.map((pr: Application) => pr.project_application_perun_id)
		this.notificationModal.showInfoNotificationModal('Info', 'Sending Mails...')

		this.emailService
			.sendCsvTemplatedMail(
				this.csvFile,
				project_ids,
				this.emailSubject,
				this.emailText,
				this.emailAdminsOnly,
				this.emailReply
			)
			.subscribe(
				() => {
					this.notificationModal.showSuccessFullNotificationModal('Success', 'Mails were successfully sent!')
				},
				() => {
					this.notificationModal.showDangerNotificationModal('Failed', 'Failed to send mails!')
				}
			)
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide()
	}

	protected readonly STATUS_LINK = STATUS_LINK
}
