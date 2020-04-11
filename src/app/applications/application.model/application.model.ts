import {ApplicationExtension} from '../application_extension.model';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {ApplicationDissemination} from '../application-dissemination';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';

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
  private _User: string;
  private _UserEmail: string;
  private _UserAffiliations: string[];
  private _PiAffiliations: string[];
  private _project_application_status: number;
  private _ComputeCenter: ComputecenterComponent;
  private _project_application_openstack_project: boolean;
  private _DaysRunning: number;
  private _ApplicationExtension: ApplicationExtension = null;
  private _project_application_perun_id: number | string;
  private _project_application_total_cores: number;
  private _project_application_total_ram: number;
  private _project_application_initial_credits: number;
  private _project_application_date_approved: string;
  private _project_application_openstack_basic_introduction: boolean;
  private _project_application_horizon2020: string;
  private _project_application_bmbf_project: string;
  private _EdamTopics: EdamOntologyTerm[];
  private _project_application_sensitive_data: boolean;
  private _project_application_elixir_project: string;
  private _Dissemination: ApplicationDissemination;
  private _project_application_pi_approved: boolean;
  private _PI: string;
  private _project_application_pi_elixir: string;
  private _PIEmail: string;
  private _project_application_cloud_service: boolean;
  private _project_application_cloud_service_develop: boolean;
  private _project_application_cloud_service_user_number: number;
  private _CurrentFlavors: Flavor[] = [];
  private _project_application_workshop: boolean;

  constructor() {
  }

  public addFlavorToCurrent(name: string, counter: number, tag: string, ram: number, rootdisk: number,
                            vcpus: number, gpu: number, epheremal_disk: number): void {
    this._CurrentFlavors[name] = {
      counter: counter,
      tag: tag,
      ram: ram,
      rootdisk: rootdisk,
      vcpus: vcpus,
      gpu: gpu,
      epheremal_disk: epheremal_disk
    };
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

  get PiAffiliations(): string[] {
    return this._PiAffiliations;
  }

  set PiAffiliations(value: string[]) {
    this._PiAffiliations = value;
  }

  get EdamTopics(): EdamOntologyTerm[] {
    return this._EdamTopics;
  }

  set EdamTopics(value: EdamOntologyTerm[]) {
    this._EdamTopics = value;
  }

  get project_application_pi_elixir(): string {
    return this._project_application_pi_elixir;
  }

  set project_application_pi_elixir(value: string) {
    this._project_application_pi_elixir = value;
  }

  get Dissemination(): ApplicationDissemination {
    return this._Dissemination;
  }

  set Dissemination(value: ApplicationDissemination) {
    this._Dissemination = value;
  }

  get project_application_pi_approved(): boolean {
    return this._project_application_pi_approved;
  }

  set project_application_pi_approved(value: boolean) {
    this._project_application_pi_approved = value;
  }

  get CurrentFlavors(): Flavor[] {
    return this._CurrentFlavors;
  }

  set CurrentFlavors(value: Flavor[]) {
    this._CurrentFlavors = value;
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

  get UserAffiliations(): string[] {
    return this._UserAffiliations
  }

  set UserAffiliations(value: string[]) {
    this._UserAffiliations = value;
  }

  get ApplicationExtension(): ApplicationExtension {
    return this._ApplicationExtension;
  }

  set ApplicationExtension(value: ApplicationExtension) {
    this._ApplicationExtension = value;
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

  get User(): string {
    return this._User;
  }

  set User(value: string) {
    this._User = value;
  }

  get project_application_status(): number {
    return this._project_application_status;
  }

  set project_application_status(value: number) {
    this._project_application_status = value;
  }

  get UserEmail(): string {
    return this._UserEmail;
  }

  set UserEmail(value: string) {
    this._UserEmail = value;
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

  get PI(): string {
    return this._PI;
  }

  set PI(value: string) {
    this._PI = value;
  }

  get PIEmail(): string {
    return this._PIEmail;
  }

  set PIEmail(value: string) {
    this._PIEmail = value;
  }

  get project_application_initial_credits(): number {
    return Number(this._project_application_initial_credits);
  }

  set project_application_initial_credits(value: number) {
    this._project_application_initial_credits = value;
  }

  get TotalExtensionCredits(): number {
    if (this.ApplicationExtension != null) {
      return Number(this.project_application_initial_credits) + Number(this.ApplicationExtension.project_application_renewal_credits)
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
