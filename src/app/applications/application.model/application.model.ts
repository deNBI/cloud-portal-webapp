import {ApplicationExtension} from '../application_extension.model';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {ApplicationDissemination} from '../application-dissemination';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';

/**
 * User Class.
 */
export class User {
  private _username: string;
  private _user_affiliations: string [];
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
  private _project_application_pi: User;
  private _project_application_status: number;
  private _ComputeCenter: ComputecenterComponent;
  private _project_application_openstack_project: boolean;
  private _DaysRunning: number;
  private _projectapplicationrenewal: ApplicationExtension = null;
  private _project_application_perun_id: number | string;
  private _project_application_total_cores: number;
  private _project_application_total_ram: number;
  private _project_application_initial_credits: number;
  private _project_application_date_approved: string;
  private _project_application_openstack_basic_introduction: boolean;
  private _project_application_horizon2020: string;
  private _project_application_bmbf_project: string;
  private _project_application_edam_terms: EdamOntologyTerm[];
  private _project_application_sensitive_data: boolean;
  private _project_application_elixir_project: string;
  private _dissemination: ApplicationDissemination;
  private _project_application_pi_approved: boolean;
  private _project_application_cloud_service: boolean;
  private _project_application_cloud_service_develop: boolean;
  private _project_application_cloud_service_user_number: number;
  private _flavors: Flavor[] = [];
  private _project_application_workshop: boolean;

  constructor(aj: Application) {
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
    this._projectapplicationrenewal = aj.projectapplicationrenewal;
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
    this._dissemination = aj.dissemination;
    this._project_application_pi_approved = aj.project_application_pi_approved;
    this._project_application_cloud_service = aj.project_application_cloud_service;
    this._project_application_cloud_service_develop = aj.project_application_cloud_service_develop;
    this._project_application_cloud_service_user_number = aj.project_application_cloud_service_user_number;
    this._flavors = aj.flavors;
    this._project_application_workshop = aj.project_application_workshop;
        console.log(this._flavors)

  }

  public getFlavorCounter(flavor: Flavor): number {
    const flavs: Flavor[] = this._flavors.filter((fl: Flavor) => {
      return fl.name === flavor.name
    });
    if (flavs.length > 0) {
      return flavs[0].counter
    }

    return 0
  }

  public addFlavorToCurrent(flavor: Flavor): void {
    this._flavors.push(flavor)
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

  get projectapplicationrenewal(): ApplicationExtension {
    return this._projectapplicationrenewal;
  }

  set projectapplicationrenewal(value: ApplicationExtension) {
    this._projectapplicationrenewal = value;
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

  get project_application_status(): number {
    return this._project_application_status;
  }

  set project_application_status(value: number) {
    this._project_application_status = value;
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

  get TotalExtensionCredits(): number {
    if (this.projectapplicationrenewal != null) {
      return Number(this.project_application_initial_credits) + Number(this.projectapplicationrenewal.project_application_renewal_credits)
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
}
