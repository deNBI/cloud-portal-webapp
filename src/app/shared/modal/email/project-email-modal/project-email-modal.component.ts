import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Application} from '../../../../applications/application.model/application.model';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {VoService} from '../../../../api-connector/vo.service';
import {IResponseTemplate} from '../../../../api-connector/response-template';

@Component({
		selector: 'app-project-email-modal',
		templateUrl: './project-email-modal.component.html',
		styleUrls: ['./projext-email-modal.component.scss'],

})
export class ProjectEmailModalComponent implements OnInit {

		//currently only for vo
		@Input() selectedProjects: Application[];
		emailAdminsOnly: boolean;
		emailSubject: string;
		emailReply: string;
		emailText: string;
		templates: string[];

		public mailSuccesfullySent: EventEmitter<boolean> = new EventEmitter();

		constructor(public bsModalRef: BsModalRef, private voService: VoService) {
				// eslint-disable-next-line no-empty-function
		}

		ngOnInit() {
				this.getMailTemplates()
		}

		getMailTemplates(): void {
				this.voService.getMailTemplates().subscribe((res: string[]) => {
						this.templates = res
				})
		}

		sentProjectsMail(): void {
				const project_ids = this.selectedProjects.map((pr: Application) => {
						return pr.project_application_perun_id;
				});

				this.voService.sendMailToProjects(project_ids, this.emailSubject, this.emailText, this.emailAdminsOnly, this.emailReply).subscribe((res: IResponseTemplate) => {
						this.mailSuccesfullySent.emit(res.value as boolean)
				}, () => {
						this.mailSuccesfullySent.emit(false)
				})
		}

		ngOnDestroy(): void {
				this.bsModalRef.hide();
		}
}
