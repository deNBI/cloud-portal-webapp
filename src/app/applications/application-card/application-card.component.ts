import {
	Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AbstractBaseClass, Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';
import { ConfirmationActions } from '../../shared/modal/confirmation_actions';
import { Application } from '../application.model/application.model';
import { ApplicationTabStates } from '../../shared/enums/application-tab-states';
import { ApplicationsService } from '../../api-connector/applications.service';
import { NotificationModalComponent } from '../../shared/modal/notification-modal';
import { is_vo } from '../../shared/globalvar';
import { VoService } from '../../api-connector/vo.service';
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component';
import { GroupService } from '../../api-connector/group.service';
import { ConfirmationModalComponent } from '../../shared/modal/confirmation-modal.component';
import { ClientLimitsComponent } from '../../vo_manager/clients/modals/client-limits..component';

@Component({
	selector: 'app-application-card',
	templateUrl: './application-card.component.html',
	styleUrl: './application-card.component.scss',
})
export class ApplicationCardComponent extends AbstractBaseClass implements OnInit {
	private subscription: Subscription = new Subscription();

		@Input() application: Application;
		@Input() tabState: ApplicationTabStates = ApplicationTabStates.SUBMITTED;
		@Input() computeCenters: ComputecenterComponent[] = [];
		@Output() reloadNumbersTrigger: EventEmitter<void> = new EventEmitter();
		@Output() removeApplicationTrigger: EventEmitter<number | string> = new EventEmitter();

		bsModalRef: BsModalRef;
		is_vo_admin: boolean = false;
		selectedComputeCenter: ComputecenterComponent;

		ngOnInit() {
			this.is_vo_admin = is_vo;

		}

		constructor(
				private applicationsService: ApplicationsService,
				private modalService: BsModalService,
				private voService: VoService,
				private groupService: GroupService,
		) {
			super();
		}

		triggerRemoveApplication() {
			console.log('trigger remove');

			this.removeApplicationTrigger.emit(this.application.project_application_id);
		}

		triggerReloadNumbers() {
			console.log('trigger reload');
			this.reloadNumbersTrigger.emit();
		}

		setCurrentUserProcessingVoManager(application: Application): void {
			if (this.is_vo_admin) {
				this.voService.setCurrentUserProcessingVoManager(application.project_application_id).subscribe((res: any) => {
					application.processing_vo_initials = res['processing_vo_initials'];
				});
			}
		}

		showConfirmationModal(action: ConfirmationActions): void {
			let initialState = {};
			if (action === ConfirmationActions.APPROVE_APPLICATION) {
				const application_center = !this.selectedComputeCenter.FacilityId;
				initialState = { application: this.application, action, application_center };
			} else {
				initialState = {
					application: this.application, action,
				};
			}
			this.bsModalRef = this.modalService.show(ConfirmationModalComponent, { initialState, class: 'modal-lg' });
			this.subscribeToBsModalRef();
		}

		unsetProcessingVoManager(application: Application): void {
			if (this.is_vo_admin) {
				this.voService.unsetProcessingVoManager(application.project_application_id).subscribe(() => {
					application.processing_vo_initials = null;
				});
			}
		}

		showClientsLimitsModal(
			is_modification_request: boolean = false,
		): void {
			const initialState = {
				compute_center_id: this.selectedComputeCenter.FacilityId,
				application: this.application,
				is_modification_request,
			};

			this.bsModalRef = this.modalService.show(ClientLimitsComponent, { initialState });
			this.subscribeToBsModalRef();
		}

		removeApplicationFromFacilityConfirmation(): void {
			this.groupService.removeGroupFromResource(this.application.project_application_perun_id.toString()).subscribe(
				(): void => {
					this.getApplication();
					this.showNotificationModal('Success', 'The application was removed from the compute center', 'success');
				},
				(): void => {
					this.showNotificationModal('Failed', 'The application was removed from the compute center', 'danger');
				},
			);
		}

		getApplication(): void {
			this.applicationsService.getApplication(this.application.project_application_id.toString()).subscribe(
				(aj: Application): void => {
					this.application = aj;
				},
				(error: any): void => {
					console.log(error);
				},
			);
		}

		assignGroupToFacility(): void {
			if (this.selectedComputeCenter) {
				this.groupService.assignGroupToResource(this.application.project_application_perun_id, this.selectedComputeCenter.Name).subscribe(
					(): void => {
						this.getApplication();

						this.showNotificationModal('Success', 'The  project was assigned to the facility.', 'success');
					},
					(error: object): void => {
						console.log(error);
						this.showNotificationModal('Failed', 'Project could not be created!', 'danger');
					},
				);
			} else {
				this.showNotificationModal('Failed', 'You need to select an compute center!', 'danger');
			}
		}

		resetApplicationPI(): void {
			this.applicationsService.resetPIValidation(this.application).subscribe((app: Application) => {
				this.getApplication();
			});
		}

		switchCollaps() {
			this.isCollapsed = !this.isCollapsed;
		}

		showNotificationModal(
			notificationModalTitle: string,
			notificationModalMessage: string,
			notificationModalType: string,
		) {
			const initialState = { notificationModalTitle, notificationModalType, notificationModalMessage };
			if (this.bsModalRef) {
				this.bsModalRef.hide();
			}

			this.bsModalRef = this.modalService.show(NotificationModalComponent, { initialState });
			this.bsModalRef.setClass('modal-lg');
		}

		adjustApplication(): void {
			this.applicationsService.adjustApplication(this.application).subscribe(
				(adjustmentResult: Application): void => {
					this.application = adjustmentResult;
					this.showNotificationModal('Success', 'The resources of the application were adjusted successfully!', 'success');
				},
				(): void => {
					this.showNotificationModal('Failed', 'The adjustment of the resources has failed!', 'danger');
				},
			);
		}

		createSimpleVmProjectGroup(): void {
			this.showNotificationModal('Info', 'Creating Project...', 'info');

			if (this.selectedComputeCenter && this.selectedComputeCenter.FacilityId) {
				this.groupService.createGroupByApplication(this.application.project_application_id, this.selectedComputeCenter.FacilityId).subscribe(
					(res: any): void => {
						if (!res['client_available'] && !res['created']) {
							this.showNotificationModal(
								'Failed',
								`The client ${res['client_name']} has not the necessary resources left!`,
								'danger',
							);
						} else {
							this.showNotificationModal('Success', 'The project was created!', 'success');
							this.triggerRemoveApplication();
							this.triggerReloadNumbers();
						}
					},
					(error: any): void => {
						console.log(error);
						const errorMessage = error && error.error === 'locked'
							? 'Project is locked and could not be created!'
							: 'Project could not be created!';

						this.showNotificationModal('Failed', errorMessage, 'danger');
						console.log(error);
					},
				);
			}
		}

		approveModificationRequest(): void {
			this.applicationsService.approveModificationRequest(this.application.project_application_id).subscribe(
				(res: Response): void => {
					this.showNotificationModal('Success', 'The resource modification request was approved!', 'success');
					if (!this.application.project_application_openstack_project) {
						if (res.status === HttpStatusCode.Accepted) {
							this.triggerRemoveApplication();
							this.triggerReloadNumbers();

							// this.all_applications.splice(this.all_applications.indexOf(application), 1);
						}
					} else {
						this.getApplication();
					}
				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Approval of resource modification failed!', 'danger');
				},
			);
		}

		declineModificationRequest(): void {
			this.applicationsService.deleteModificationRequest(this.application.project_application_id).subscribe(
				(): void => {
					this.showNotificationModal('Declined', 'The resource modification request was declined!', 'success');
					this.triggerReloadNumbers();
					this.triggerRemoveApplication();

					this.getApplication();
				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Decline of resource modification failed!', 'danger');
				},
			);
		}

		deleteApplication(): void {
			// const idx: number = this.all_applications.indexOf(application);

			this.subscription.add(
				this.applicationsService.deleteApplication(this.application.project_application_id).subscribe(
					(): void => {
						this.showNotificationModal('Success', 'The application has been successfully removed', 'success');
						this.triggerRemoveApplication();
						this.triggerReloadNumbers();

					},
					(): void => {
						this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
					},
				),
			);
		}

		declineLifetimeExtension(): void {
			this.applicationsService.deleteAdditionalLifetimeRequests(this.application.project_application_id).subscribe(
				(): void => {
					this.showNotificationModal('Declined', 'The project extension was declined!', 'success');
					this.triggerRemoveApplication();
					this.triggerReloadNumbers();

				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Decline of project extension failed!', 'danger');
				},
			);
		}

		declineCreditExtension(): void {
			this.applicationsService.deleteAdditionalCreditsRequests(this.application.project_application_id).subscribe(
				(): void => {
					this.showNotificationModal('Declined', 'The credit extension request was declined!', 'success');
					this.triggerRemoveApplication();
					this.triggerReloadNumbers();

				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Decline of credit extension failed!', 'danger');
				},
			);
		}

		declineApplication(): void {
			// const idx: number = this.all_applications.indexOf(app);
			this.applicationsService.declineApplication(this.application.project_application_id).subscribe(
				(): void => {
					const message: string = 'The Application was declined.';

					this.showNotificationModal('Success', message, 'success');
					this.triggerRemoveApplication();
					this.triggerReloadNumbers();

				},
				(): void => {
					this.showNotificationModal('Failed', 'Application could not be declined!', 'danger');
				},
			);
		}

		approveLifetimeExtension(): void {
			this.applicationsService.approveAdditionalLifetime(this.application.project_application_id).subscribe(
				(res: Response): void => {
					if (this.application.project_application_openstack_project) {
						this.getApplication();
						this.showNotificationModal('Success', 'The request has been sent to the facility manager.', 'success');
					} else {
						this.showNotificationModal('Success', 'The project has been extended!', 'success');
					}
					if (!this.application.project_application_openstack_project) {
						if (res.status === HttpStatusCode.Accepted) {
							this.triggerReloadNumbers();
							this.triggerRemoveApplication();

						}
					}
				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Project lifetime could not be extendend!', 'danger');
				},
			);
		}

		approveCreditExtension(): void {
			this.applicationsService.approveAdditionalCreditsRequest(this.application.project_application_id).subscribe(
				(res: Response): void => {
					this.showNotificationModal('Success', 'The credit extension request was approved!', 'success');
					if (!this.application.project_application_openstack_project) {
						if (res.status === HttpStatusCode.Accepted) {
							this.triggerReloadNumbers();
							this.triggerRemoveApplication();

						}
					} else {

						this.getApplication();
					}
				},
				(err: any): void => {
					console.log('error', err.status);
					this.showNotificationModal('Failed', 'Approval of credit extension failed!', 'danger');
				},
			);
		}

		createOpenStackProjectGroup(): void {
			this.groupService.createGroupOpenStack(this.application.project_application_id, this.selectedComputeCenter.Name).subscribe(
				(result: { [key: string]: string }): void => {
					if (result['Error']) {
						this.showNotificationModal('Failed', result['Error'], 'danger');
					} else {
						this.showNotificationModal('Success', 'The  project was assigned to the facility.', 'success');
						this.getApplication();
						// this.switchApproveLocked(false);
					}
				},
				(error: any): void => {
					const errorMessage = error && error.error === 'locked'
						? 'Project is locked and could not be created!'
						: 'Project could not be created!';

					this.showNotificationModal('Failed', errorMessage, 'danger');
					console.log(error);
				},
			);
		}

		/**
		 * Function to listen to modal results.
		 */
		subscribeToBsModalRef(): void {
			this.subscription.add(
				this.bsModalRef.content.event.subscribe((result: any) => {
					let action = null;
					if ('action' in result) {
						action = result['action'];
					}
					if ('createSimpleVM' in result) {
						this.createSimpleVmProjectGroup();
					}
					if (action === ConfirmationActions.APPROVE_MODIFICATION) {
						this.approveModificationRequest();
					}
					if ('closed' in result) {
						//	this.switchApproveLocked(false);
					}
					if (action === ConfirmationActions.DECLINE_MODIFICATION) {
						this.declineModificationRequest();
					}
					if (action === ConfirmationActions.DELETE_APPLICATION) {
						this.deleteApplication();
					}
					if (action === ConfirmationActions.DECLINE_EXTENSION) {
						this.declineLifetimeExtension();
					}
					if (action === ConfirmationActions.DECLINE_CREDITS) {
						this.declineCreditExtension();
					}
					if (action === ConfirmationActions.DECLINE_APPLICATION) {
						this.declineApplication();
					}

					if (action === ConfirmationActions.APPROVE_EXTENSION) {
						this.approveLifetimeExtension();
					}
					if (action === ConfirmationActions.RESET_PI) {
						this.resetApplicationPI();
					}
					if (action === ConfirmationActions.APPROVE_CREDITS) {
						this.approveCreditExtension();
					}
					if (action === ConfirmationActions.APPROVE_APPLICATION) {
						if (this.application.project_application_openstack_project) {
							this.createOpenStackProjectGroup();
						}
					}
					if (action === 'adjustedModificationRequest') {
						//	this.isLoaded = false;
						// this.changeTabState(ApplicationTabStates.MODIFICATION_EXTENSION);
					}
				}),
			);
		}

		isCollapsed: boolean = true;
		protected readonly Application_States = Application_States;
		protected readonly ConfirmationActions = ConfirmationActions;
}
