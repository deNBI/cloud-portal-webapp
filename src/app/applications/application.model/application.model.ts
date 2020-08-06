import {ApplicationLifetimeExtension} from '../application_extension.model';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {ApplicationDissemination} from '../application-dissemination';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';
import {Application_States} from '../../shared/shared_modules/baseClass/abstract-base-class';
import {ApplicationModification} from '../application_modification.model';
import {ApplicationCreditRequest} from '../application_credit_request';

/**
 * User Class.
 */
export class User {
  private _username: string;
  private _user_affiliations: string [] = [];
  private _elixir_id: string;
  private _email: string;

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get user_affiliations(): string[] {
    return this._user_affiliations;
  }

  set user_affiliations(value: string[]) {
    this._user_affiliations = value;
  }

  get elixir_id(): string {
    return this._elixir_id;
  }

  set elixir_id(value: string) {
    this._elixir_id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}

/**
 * Application class.
 */
export class Application {

  private _project_application_id: number | string;
  private _project_application_report_allowed: boolean = false;
  private _project_application_name: string;
  private _project_application_shortname: string;
  private _project_application_institute: string;
  private _project_application_workgroup: string;
  private _project_application_lifetime: number;
  private _project_application_vms_requested: number;
  private _project_application_volume_limit: number;
  private _project_application_volume_counter: number;
  private _project_application_object_storage: number;
  private _project_application_description: string;
  private _project_application_comment: string;
  private _project_application_date_submitted: string;
  private _project_application_date_status_changed: string;
  private _project_application_user: User;
  private _project_application_pi: User = new User();
  private _project_application_status: number[] = [];
  private _ComputeCenter: ComputecenterComponent;
  private _project_application_openstack_project: boolean;
  private _DaysRunning: number;
  private _project_lifetime_request: ApplicationLifetimeExtension = null;
  private _project_modification_request: ApplicationModification;
  private _project_credit_request: ApplicationCreditRequest = null;
  private _project_application_perun_id: number | string;
  private _project_application_total_cores: number;
  private _project_application_total_ram: number;
  private _project_application_initial_credits: number;
  private _project_application_date_approved: string;
  private _project_application_openstack_basic_introduction: boolean;
  private _project_application_horizon2020: string;
  private _project_application_bmbf_project: string;
  private _project_application_edam_terms: EdamOntologyTerm[] = [];
  private _project_application_sensitive_data: boolean;
  private _project_application_elixir_project: string;
  private _dissemination: ApplicationDissemination;
  private _project_application_pi_approved: boolean;
  private _project_application_cloud_service: boolean;
  private _project_application_cloud_service_develop: boolean;
  private _project_application_cloud_service_user_number: number;
  private _flavors: Flavor[] = [];
  private _project_application_workshop: boolean;
  private _hasSubmittedStatus: boolean = false;
  private _hasApprovedStatus: boolean = false;
  private _hasTerminatedStatus: boolean = false;
  private _hasConfirmationDeniedStatus: boolean = false;
  private _hasCreditsExtensionDeclinedStatus: boolean = false;
  private _hasLifeTimeExtensionRequested: boolean = false;
  private _hasCreditsRequestedStatus: boolean = false;
  private _hasDeclinedStatus: boolean = false;
  private _hasModificationDeclinedStatus: boolean = false;
  private _hasSuspendedStatus: boolean = false;
  private _hasWaitForConfirmationStatus: boolean = false;
  private _hasModificationRequestedStatus: boolean = false;
  private _hasWaitForExtensionConfirmationStatus: boolean = false;
  private _hasWaitForModificationConfirmationStatus: boolean = false;
  private _hasWaitForCreditConfirmationStatus: boolean = false;
  private _hasLifeTimeExtensionDenied: boolean = false;

  constructor(aj: Application | null) {
    this._dissemination = new ApplicationDissemination(null);

    if (aj) {
      this._project_application_id = aj.project_application_id;
      this._project_application_name = aj.project_application_name;
      this._project_application_shortname = aj.project_application_shortname;
      this._project_application_institute = aj.project_application_institute;
      this._project_application_workgroup = aj.project_application_workgroup;
      this._project_application_lifetime = aj.project_application_lifetime;
      this._project_application_vms_requested = aj.project_application_vms_requested;
      this._project_application_volume_limit = aj.project_application_volume_limit;
      this._project_application_volume_counter = aj.project_application_volume_counter;
      this._project_application_object_storage = aj.project_application_object_storage;
      this._project_application_description = aj.project_application_description;
      this._project_application_comment = aj.project_application_comment;
      this._project_application_date_submitted = aj.project_application_date_submitted;
      this._project_application_date_status_changed = aj.project_application_date_status_changed;
      this._project_application_user = aj.project_application_user;
      this._project_application_pi = aj.project_application_pi;
      this._project_application_status = aj.project_application_status;
      this._ComputeCenter = aj.ComputeCenter;
      this._project_application_openstack_project = aj.project_application_openstack_project;
      this._DaysRunning = aj.DaysRunning;
      if (aj.project_lifetime_request) {
        this._project_lifetime_request = new ApplicationLifetimeExtension(aj.project_lifetime_request);
      }
      if (aj.project_modification_request){
        this._project_modification_request = new ApplicationModification(aj.project_modification_request);
      }
      this._project_application_perun_id = aj.project_application_perun_id;
      this._project_application_total_cores = aj.project_application_total_cores;
      this._project_application_total_ram = aj.project_application_total_ram;
      this._project_application_initial_credits = aj.project_application_initial_credits;
      this._project_application_date_approved = aj.project_application_date_approved;
      this._project_application_openstack_basic_introduction = aj.project_application_openstack_basic_introduction;
      this._project_application_horizon2020 = aj.project_application_horizon2020;
      this._project_application_bmbf_project = aj.project_application_bmbf_project;
      this._project_application_edam_terms = aj.project_application_edam_terms;
      this._project_application_sensitive_data = aj.project_application_sensitive_data;
      this._project_application_elixir_project = aj.project_application_elixir_project;
      this._project_application_pi_approved = aj.project_application_pi_approved;
      this._project_application_cloud_service = aj.project_application_cloud_service;
      this._project_application_cloud_service_develop = aj.project_application_cloud_service_develop;
      this._project_application_cloud_service_user_number = aj.project_application_cloud_service_user_number;
      this._flavors = aj.flavors;
      this._project_application_workshop = aj.project_application_workshop;
      if (aj.dissemination) {
        this._dissemination = new ApplicationDissemination(aj.dissemination);
        this._project_application_report_allowed = this._dissemination.someAllowed();
      }
      this.setDaysRunning()
    }
    this.setStatusValues()
  }

  private setStatusValues(): void {
    if (this.project_application_status){
      this.project_application_status.forEach((status: number): void => {
        switch (status) {
          case Application_States.SUBMITTED: {
            this._hasSubmittedStatus = true;
            break
          }
          case Application_States.APPROVED: {
            this._hasApprovedStatus = true;
            break
          }
          case Application_States.TERMINATED: {
            this._hasTerminatedStatus = true;
            break
          }
          case Application_States.CONFIRMATION_DENIED: {
            this._hasConfirmationDeniedStatus = true;
            break
          }
          case Application_States.CREDITS_EXTENSION_DENIED: {
            this._hasCreditsExtensionDeclinedStatus = true;
            break
          }
          case Application_States.LIFETIME_EXTENSION_REQUESTED: {
            this._hasLifeTimeExtensionRequested = true;
            break
          }
          case Application_States.LIFETIME_EXTENSION_DENIED: {
            this._hasLifeTimeExtensionDenied = true;
            break
          }
          case Application_States.CREDITS_EXTENSION_REQUESTED: {
            this._hasCreditsRequestedStatus = true;
            break
          }
          case Application_States.DECLINED: {
            this._hasDeclinedStatus = true;
            break
          }
          case Application_States.WAIT_FOR_CONFIRMATION: {
            this._hasWaitForConfirmationStatus = true;
            break
          }
          case Application_States.WAIT_FOR_CONFIRMATION_CREDITS: {
            this._hasWaitForCreditConfirmationStatus = true;
            break
          }
          case Application_States.WAIT_FOR_CONFIRMATION_EXTENSION: {
            this._hasWaitForExtensionConfirmationStatus = true;
            break
          }
          case Application_States.WAIT_FOR_CONFIRMATION_MODIFICATION: {
            this._hasWaitForModificationConfirmationStatus = true;
            break
          }
          case Application_States.SUSPENDED: {
            this._hasSuspendedStatus = true;
            break
          }
          case Application_States.MODIFICATION_REQUESTED: {
            this._hasModificationRequestedStatus = true;
            break
          }
          case Application_States.MODIFICATION_DECLINED: {
            this._hasModificationDeclinedStatus = true;
            break
          }
          default: {
            break
          }

        }
      })
    }

  }

  public hasSubmittedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.SUBMITTED)
  }

  public hasApprovedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.APPROVED)
  }

  public hasTerminatedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.TERMINATED)
  }

  public hasConfirmationDeniedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CONFIRMATION_DENIED)
  }

  public hasCreditsDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CREDITS_EXTENSION_DENIED)
  }

  public hasCreditsRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CREDITS_EXTENSION_REQUESTED)
  }

  public hasDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.DECLINED)
  }

  public hasExtensionDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.LIFETIME_EXTENSION_DENIED)
  }

  public hasExtensionRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.LIFETIME_EXTENSION_REQUESTED)
  }

  public hasModificationDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.MODIFICATION_DECLINED)
  }

  public hasSuspendedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.SUSPENDED)
  }

  public hasWaitForConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION)
  }

  public hasModificationRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.MODIFICATION_REQUESTED)
  }

  public hasWaitForExtensionConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_EXTENSION)
  }

  public hasWaitForModificationConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_MODIFICATION)
  }

  public hasWaitForCreditConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_CREDITS)
  }

  private setDaysRunning(): void {
    if (this.project_application_status != null) {
      if (this.project_application_status.includes(Application_States.APPROVED)) {
        // tslint:disable-next-line:max-line-length
        this._DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(this.project_application_date_approved).getTime())) / (1000 * 3600 * 24));
      }
    }
  }

  public addEdamTerm(term: EdamOntologyTerm): void {
    if (this.project_application_edam_terms.indexOf(term) === -1) {
      this.project_application_edam_terms.push(term);
    }
  }

  public removeEdamTerm(term: EdamOntologyTerm): void {
    const idx: number = this.project_application_edam_terms.indexOf(term)
    if (idx !== -1) {
      this.project_application_edam_terms.splice(idx, 1);
    }
  }

  public getFlavorCounter(flavor: Flavor): number {
    const flavs: Flavor[] = this._flavors.filter((fl: Flavor): boolean => {
      return fl.name === flavor.name
    });
    if (flavs.length > 0) {
      return flavs[0].counter
    }

    return 0
  }

  public setFlavorInFlavors(flavor: Flavor, counter: number): void {
    const idx: number = this._flavors.findIndex((fl: Flavor): boolean => {
      return fl.name === flavor.name
    });
    if (idx !== -1) {
      if (counter > 0) {
        this._flavors[idx].counter = counter;
      } else {
        this._flavors.splice(idx, 1)
      }
    } else {
      if (counter > 0) {

        flavor.counter = counter;

        this._flavors.push(flavor)
      }
    }
  }

  get project_application_report_allowed(): boolean {
    return this._project_application_report_allowed;
  }

  set project_application_report_allowed(value: boolean) {
    this._project_application_report_allowed = value;
  }

  get project_application_user(): User {
    return this._project_application_user;
  }

  set project_application_user(value: User) {
    this._project_application_user = value;
  }

  get project_application_pi(): User {
    return this._project_application_pi;
  }

  set project_application_pi(value: User) {
    this._project_application_pi = value;
  }

  get project_application_workshop(): boolean {
    return this._project_application_workshop;
  }

  set project_application_workshop(value: boolean) {
    this._project_application_workshop = value;
  }

  get project_application_cloud_service(): boolean {
    return this._project_application_cloud_service;
  }

  set project_application_cloud_service(value: boolean) {
    this._project_application_cloud_service = value;
  }

  get project_application_cloud_service_user_number(): number {
    return this._project_application_cloud_service_user_number;
  }

  set project_application_cloud_service_user_number(value: number) {
    this._project_application_cloud_service_user_number = value;
  }

  get project_application_openstack_basic_introduction(): boolean {
    return this._project_application_openstack_basic_introduction;
  }

  set project_application_openstack_basic_introduction(value: boolean) {
    this._project_application_openstack_basic_introduction = value;
  }

  get project_application_sensitive_data(): boolean {
    return this._project_application_sensitive_data;
  }

  set project_application_sensitive_data(value: boolean) {
    this._project_application_sensitive_data = value;
  }

  get project_application_edam_terms(): EdamOntologyTerm[] {
    return this._project_application_edam_terms;
  }

  set project_application_edam_terms(value: EdamOntologyTerm[]) {
    this._project_application_edam_terms = value;
  }

  get dissemination(): ApplicationDissemination {
    return this._dissemination;
  }

  set dissemination(value: ApplicationDissemination) {
    this._dissemination = value;
  }

  get project_application_pi_approved(): boolean {
    return this._project_application_pi_approved;
  }

  set project_application_pi_approved(value: boolean) {
    this._project_application_pi_approved = value;
  }

  get flavors(): Flavor[] {
    return this._flavors;
  }

  set flavors(value: Flavor[]) {
    this._flavors = value;
  }

  get project_application_date_approved(): string {
    return this._project_application_date_approved;
  }

  set project_application_date_approved(value: string) {
    this._project_application_date_approved = value;
  }

  get project_application_total_cores(): number {
    return this._project_application_total_cores;
  }

  set project_application_total_cores(value: number) {
    this._project_application_total_cores = value;
  }

  get project_application_total_ram(): number {
    return this._project_application_total_ram;
  }

  set project_application_total_ram(value: number) {
    this._project_application_total_ram = value;
  }

  get project_lifetime_request(): ApplicationLifetimeExtension {
    return this._project_lifetime_request;
  }

  set project_lifetime_request(value: ApplicationLifetimeExtension) {
    this._project_lifetime_request = value;
  }

  get DaysRunning(): number {
    return this._DaysRunning;
  }

  set DaysRunning(value: number) {
    this._DaysRunning = value;
  }

  get project_application_openstack_project(): boolean {
    return this._project_application_openstack_project
  }

  set project_application_openstack_project(value: boolean) {
    this._project_application_openstack_project = value;
  }

  get ComputeCenter(): ComputecenterComponent {
    return this._ComputeCenter
  }

  set ComputeCenter(value: ComputecenterComponent) {
    this._ComputeCenter = value;
  }

  get project_application_id(): number | string {
    return this._project_application_id;
  }

  set project_application_id(value: number | string) {
    this._project_application_id = value;
  }

  get project_application_name(): string {
    return this._project_application_name;
  }

  set project_application_name(value: string) {
    this._project_application_name = value;
  }

  set project_application_comment(value: string) {
    this._project_application_comment = value;
  }

  get project_application_comment(): string {
    return this._project_application_comment;
  }

  get project_application_shortname(): string {
    return this._project_application_shortname;
  }

  set project_application_shortname(value: string) {
    this._project_application_shortname = value;
  }

  get project_application_institute(): string {
    return this._project_application_institute;
  }

  set project_application_institute(value: string) {
    this._project_application_institute = value;
  }

  get project_application_workgroup(): string {
    return this._project_application_workgroup;
  }

  set project_application_workgroup(value: string) {
    this._project_application_workgroup = value;
  }

  get project_application_lifetime(): number {
    return this._project_application_lifetime;
  }

  set project_application_lifetime(value: number) {
    this._project_application_lifetime = value;
  }

  get project_application_vms_requested(): number {
    return this._project_application_vms_requested;
  }

  set project_application_vms_requested(value: number) {
    this._project_application_vms_requested = value;
  }

  get project_application_volume_limit(): number {
    return this._project_application_volume_limit;
  }

  set project_application_volume_limit(value: number) {
    this._project_application_volume_limit = value;
  }

  get project_application_volume_counter(): number {
    return this._project_application_volume_counter;
  }

  set project_application_volume_counter(value: number) {
    this._project_application_volume_counter = value;
  }

  get project_application_object_storage(): number {
    return this._project_application_object_storage;
  }

  set project_application_object_storage(value: number) {
    this._project_application_object_storage = value;
  }

  get project_application_description(): string {
    return this._project_application_description;
  }

  set project_application_description(value: string) {
    this._project_application_description = value;
  }

  get project_application_date_submitted(): string {
    return this._project_application_date_submitted;
  }

  set project_application_date_submitted(value: string) {
    this._project_application_date_submitted = value;
  }

  get project_application_date_status_changed(): string {
    return this._project_application_date_status_changed;
  }

  set project_application_date_status_changed(value: string) {
    this._project_application_date_status_changed = value;
  }

  get project_application_status(): number [] {
    return this._project_application_status;
  }

  set project_application_status(values: number[]) {
    this._project_application_status = values;
  }

  get project_application_perun_id(): number | string {
    return this._project_application_perun_id;
  }

  set project_application_perun_id(value: number | string) {
    this._project_application_perun_id = value;
  }

  get project_application_bmbf_project(): string {
    return this._project_application_bmbf_project;
  }

  set project_application_bmbf_project(value: string) {
    this._project_application_bmbf_project = value;
  }

  get project_application_horizon2020(): string {
    return this._project_application_horizon2020;
  }

  set project_application_horizon2020(value: string) {
    this._project_application_horizon2020 = value;
  }

  get project_application_elixir_project(): string {
    return this._project_application_elixir_project;
  }

  set project_application_elixir_project(value: string) {
    this._project_application_elixir_project = value;
  }

  get project_application_initial_credits(): number {
    return Number(this._project_application_initial_credits);
  }

  set project_application_initial_credits(value: number) {
    this._project_application_initial_credits = value;
  }

  get TotalModificationCredits(): number {
    if (this.project_modification_request != null) {
      return Number(this.project_application_initial_credits) +
        Number(this.project_modification_request.extra_credits)
    } else {
      return this.project_application_initial_credits
    }
  }

  get project_application_cloud_service_develop(): boolean {
    return this._project_application_cloud_service_develop;
  }

  set project_application_cloud_service_develop(value: boolean) {
    this._project_application_cloud_service_develop = value;
  }

  get project_modification_request(): ApplicationModification {
    return this._project_modification_request;
  }

  set project_modification_request(value: ApplicationModification) {
    this._project_modification_request = value;
  }

  get project_credit_request(): ApplicationCreditRequest {
    return this._project_credit_request;
  }

  set project_credit_request(value: ApplicationCreditRequest) {
    this._project_credit_request = value;
  }
}
