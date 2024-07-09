import {
	Component, EventEmitter, Input, OnDestroy, OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Application } from '../../../../applications/application.model/application.model';
import { VoService } from '../../../../api-connector/vo.service';
import { IResponseTemplate } from '../../../../api-connector/response-template';
import { EmailService } from '../../../../api-connector/email.service';
import { STATUS_LINK } from '../../../../../links/links';
import { CsvMailTemplateModel } from '../../../classes/csvMailTemplate.model';

@Component({
	selector: 'app-project-email-modal',
	templateUrl: './project-email-modal.component.html',
	styleUrls: ['./projext-email-modal.component.scss'],
	providers: [EmailService],
})
export class ProjectEmailModalComponent implements OnInit, OnDestroy {
	@Input() selectedProjects: Application[];
	@Input() csvMailTemplate: CsvMailTemplateModel;
	@Input() csvFile: File;

	emailAdminsOnly: boolean;
	emailSubject: string;
	emailReply: string;
	emailText: string;
	templates: string[];
	validCSVExample = `Project, Key1, Key2
Proj1, ValK1, ValK2
Proj2, ValK1, ValK2`;

	public event: EventEmitter<boolean> = new EventEmitter();

	constructor(
		public bsModalRef: BsModalRef,
		private voService: VoService,
		private emailService: EmailService,
	) {
		// eslint-disable-next-line no-empty-function
	}

	ngOnInit() {
		this.getMailTemplates();
	}

	getMailTemplates(): void {
		this.emailService.getMailTemplates().subscribe((res: string[]) => {
			this.templates = res;
		});
	}

	sentProjectsTemplatedMail(): void {
		const project_ids = this.selectedProjects.map((pr: Application) => pr.project_application_perun_id);

		this.emailService
			.sendCsvTemplatedMail(
				this.csvFile,
				project_ids,
				this.emailSubject,
				this.emailText,
				this.emailAdminsOnly,
				this.emailReply,
			)
			.subscribe(
				(res: IResponseTemplate) => {
					this.event.emit(res.value as boolean);
				},
				() => {
					this.event.emit(false);
				},
			);
	}

	sentProjectsMail(): void {
		const project_ids = this.selectedProjects.map((pr: Application) => pr.project_application_perun_id);

		this.emailService
			.sendMailToProjects(project_ids, this.emailSubject, this.emailText, this.emailAdminsOnly, this.emailReply)
			.subscribe(
				(res: IResponseTemplate) => {
					this.event.emit(res.value as boolean);
				},
				() => {
					this.event.emit(false);
				},
			);
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide();
	}

	protected readonly STATUS_LINK = STATUS_LINK;
}
