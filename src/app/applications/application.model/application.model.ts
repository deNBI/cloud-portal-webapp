import { ApplicationLifetimeExtension } from '../application_extension.model';
import { ComputecenterComponent } from '../../projectmanagement/computecenter.component';
import { ApplicationDissemination } from '../application-dissemination';
import { EdamOntologyTerm } from '../edam-ontology-term';
import { Flavor } from '../../virtualmachines/virtualmachinemodels/flavor';
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';
import { ApplicationModification } from '../application_modification.model';
import { ApplicationCreditRequest } from '../application_credit_request';
import { User } from './user.model';

/**
 * Application class.
 */
export class Application {

	project_application_id: number | string;
	project_application_report_allowed: boolean = false;
	project_application_name: string;
	project_application_shortname: string;
	project_application_institute: string;
	project_application_workgroup: string;
	project_application_lifetime: number;
	project_application_vms_requested: number;
	project_application_volume_limit: number;
	project_application_volume_counter: number;
	project_application_object_storage: number;
	project_application_description: string;
	project_application_comment: string;
	project_application_date_submitted: string;
	project_application_date_status_changed: string;
	project_application_hash: string;
	project_application_user: User;
	project_application_pi: User = new User();
	project_application_status: number[] = [];
	ComputeCenter: ComputecenterComponent;
	project_application_openstack_project: boolean;
	project_application_total_gpu: number = 0;

	DaysRunning: number;
	project_lifetime_request: ApplicationLifetimeExtension;
	project_modification_request: ApplicationModification;
	project_credit_request: ApplicationCreditRequest = null;
	project_application_perun_id: number | string;
	project_application_total_cores: number;
	project_application_total_ram: number;
	project_application_initial_credits: number = 0;
	project_application_date_approved: string;
	project_application_openstack_basic_introduction: boolean;
	project_application_horizon2020: string;
	project_application_dfg: string;
	project_application_bmbf_project: string;
	project_application_nfdi: string;
	project_application_edam_terms: EdamOntologyTerm[] = [];
	project_application_sensitive_data: boolean;
	project_application_elixir_project: string;
	dissemination: ApplicationDissemination;
	project_application_pi_approved: boolean;
	project_application_cloud_service: boolean;
	project_application_cloud_service_develop: boolean;
	project_application_cloud_service_user_number: number;
	flavors: Flavor[] = [];
	project_application_workshop: boolean;
	credits_allowed: boolean = false;
	credits_loop_started: boolean = false;
	totalModificationRequestCredits: number = 0;
	totalCreditsExtensionCredits: number = 0;
	totalLifetimeExtensionCredits: number = 0;
	// memberNamesVisible: boolean = false;

	constructor(aj?: Partial<Application>) {
		this.dissemination = new ApplicationDissemination(null);
		Object.assign(this, aj);
		if (aj) {
			if (aj.dissemination) {
				this.dissemination = new ApplicationDissemination(aj.dissemination);
				this.project_application_report_allowed = this.dissemination.someAllowed();
			}
			this.setDaysRunning();

			if (aj.project_lifetime_request) {
				this.project_lifetime_request = new ApplicationLifetimeExtension(aj.project_lifetime_request);
				this.totalLifetimeExtensionCredits = this.calcLifetimeExtensionCredits();
			}

			if (aj.project_modification_request) {
				this.project_modification_request = new ApplicationModification(aj.project_modification_request);
				this.totalModificationRequestCredits = this.calcTotalModificationCredits();
			}

			if (aj.project_credit_request) {
				this.project_credit_request = new ApplicationCreditRequest(aj.project_credit_request);
				this.totalCreditsExtensionCredits = this.calcCreditsExtensionCredits();
			}

			if (aj.flavors) {
				this.flavors = [];
				for (const flavor of aj.flavors) {
					this.flavors.push(new Flavor(flavor));
				}
			}

			this.project_application_initial_credits = Number(aj.project_application_initial_credits);
		}
	}

	public hasSubmittedStatus(): boolean {
		return this.project_application_status?.includes(Application_States.SUBMITTED);
	}

	public hasTerminatedStatus(): boolean {
		return this.project_application_status?.includes(Application_States.TERMINATED);
	}

	private setDaysRunning(): void {
		if (this.project_application_status != null) {
			if (this.project_application_status.includes(Application_States.APPROVED)) {
				this.DaysRunning = Math
					.ceil((Math.abs(Date.now() - new Date(this.project_application_date_approved).getTime())) / (1000 * 3600 * 24));
			}
		}
	}

	public addEdamTerm(term: EdamOntologyTerm): void {
		if (this.project_application_edam_terms.indexOf(term) === -1) {
			this.project_application_edam_terms.push(term);
		}
	}

	public removeEdamTerm(term: EdamOntologyTerm): void {
		const idx: number = this.project_application_edam_terms.indexOf(term);
		if (idx !== -1) {
			this.project_application_edam_terms.splice(idx, 1);
		}
	}

	public getFlavorCounter(flavor_to_test: Flavor): number {
		if (this.flavors) {
			for (const flavor of this.flavors) {
				if (flavor.name === flavor_to_test.name) {

					return flavor.counter;
				}
			}

			return 0;

		} else return 0;
	}

	public setFlavorInFlavors(flavor_param: Flavor, counter: number): void {
		const idx: number = this.flavors.findIndex((fl: Flavor): boolean => fl.name === flavor_param.name);
		if (idx !== -1) {
			if (counter > 0) {
				this.flavors[idx].counter = counter;
			} else {
				this.flavors.splice(idx, 1);
			}
		} else {
			if (counter > 0) {
				const flavor: Flavor = flavor_param;
				flavor.counter = counter;
				this.flavors.push(flavor);
			}
			this.setDaysRunning();
		}
	}

	public calcTotalModificationCredits(): number {
		if (this.project_modification_request != null) {
			const total_credits: number = Number(this.project_application_initial_credits) + Number(this.project_modification_request.extra_credits);
			if (total_credits <= 0) {
				return 0;
			} else {
				return total_credits;
			}
		} else {
			return Number(this.project_application_initial_credits);
		}
	}

	public calcCreditsExtensionCredits(): number {
		if (this.project_credit_request != null) {
			return (Math.round(this.project_application_initial_credits * 10) / 10)
				+ (Math.round((this.project_credit_request.extra_credits * 10) / 10));
		} else {
			return this.project_application_initial_credits;
		}
	}

	public calcLifetimeExtensionCredits(): number {

		if (this.project_lifetime_request != null) {
			return (Math.round(this.project_application_initial_credits * 10) / 10)
				+ (Math.round((this.project_lifetime_request.extra_credits * 10) / 10));
		} else {
			return this.project_application_initial_credits;
		}
	}

	public setCreditsLoopStarted(): void {
		this.credits_loop_started = true;
	}

}
