import {
		Component, EventEmitter, Input, OnDestroy, OnInit,
} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Application} from '../../../../applications/application.model/application.model';
import {VoService} from '../../../../api-connector/vo.service';
import {IResponseTemplate} from '../../../../api-connector/response-template';
import {EmailService} from '../../../../api-connector/email.service';

@Component({
		selector: 'app-project-email-modal',
		templateUrl: './project-email-modal.component.html',
		styleUrls: ['./projext-email-modal.component.scss'],
		providers: [EmailService]
})
export class ProjectEmailModalComponent implements OnInit, OnDestroy {
		// currently only for vo
		@Input() selectedProjects: Application[];
		emailAdminsOnly: boolean;
		emailSubject: string;
		emailReply: string;
		emailText: string;
		templates: string[];

		public event: EventEmitter<boolean> = new EventEmitter();

		constructor(public bsModalRef: BsModalRef, private voService: VoService, private emailService: EmailService) {
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
}
