import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';

/**
 * Application Extension class.
 */
export class ApplicationExtension {

  private _Id: number;
  private _project_application_renewal_lifetime: number;
  private _project_application_renewal_vms_requested: number;
  private _project_application_renewal_volume_limit: number;
  private _project_application_renewal_volume_counter: number;
  private _project_application_renewal_object_storage: number;
  private _project_application_renewal_comment: string;
  private _project_application_renewal_date_submitted: string;
  private _project_application_renewal_openstack_project: boolean;
  private _project_application_renewal_total_cores: number;
  private _project_application_renewal_total_ram: number;
  private _project_application_renewal_credits: number;
  private _is_only_extra_credits_application: boolean;
  private _project_application_cloud_service_user_number: number;
  private _flavors: Flavor[] = [];

  constructor() {

  }

  public addFlavorToRequested(flavor: Flavor): void {
    this._flavors.push(flavor)
  }

  get flavors(): Flavor[] {
    return this._flavors;
  }

  set flavors(value: Flavor[]) {
    this._flavors = value;
  }

  get project_application_renewal_total_cores(): number {
    return this._project_application_renewal_total_cores;
  }

  set project_application_renewal_total_cores(value: number) {
    this._project_application_renewal_total_cores = value;
  }

  get project_application_renewal_total_ram(): number {
    return this._project_application_renewal_total_ram;
  }

  set project_application_renewal_total_ram(value: number) {
    this._project_application_renewal_total_ram = value;
  }

  get project_application_renewal_lifetime(): number {
    return this._project_application_renewal_lifetime;
  }

  set project_application_renewal_lifetime(value: number) {
    this._project_application_renewal_lifetime = value;
  }

  get project_application_renewal_openstack_project(): boolean {
    return this._project_application_renewal_openstack_project
  }

  set project_application_renewal_openstack_project(value: boolean) {
    this._project_application_renewal_openstack_project = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  set project_application_renewal_comment(value: string) {
    this._project_application_renewal_comment = value;
  }

  get project_application_renewal_comment(): string {
    return this._project_application_renewal_comment;
  }

  get project_application_renewal_vms_requested(): number {
    return this._project_application_renewal_vms_requested;
  }

  set project_application_renewal_vms_requested(value: number) {
    this._project_application_renewal_vms_requested = value;
  }

  get project_application_renewal_volume_limit(): number {
    return this._project_application_renewal_volume_limit;
  }

  set project_application_renewal_volume_limit(value: number) {
    this._project_application_renewal_volume_limit = value;
  }

  get project_application_renewal_volume_counter(): number {
    return this._project_application_renewal_volume_counter;
  }

  set project_application_renewal_volume_counter(value: number) {
    this._project_application_renewal_volume_counter = value;
  }

  get project_application_renewal_object_storage(): number {
    return this._project_application_renewal_object_storage;
  }

  set project_application_renewal_object_storage(value: number) {
    this._project_application_renewal_object_storage = value;
  }


  get project_application_renewal_date_submitted(): string {
    return this._project_application_renewal_date_submitted;
  }

  set project_application_renewal_date_submitted(value: string) {
    this._project_application_renewal_date_submitted = value;
  }

  get project_application_renewal_credits(): number {
    return Number(this._project_application_renewal_credits);
  }

  set project_application_renewal_credits(value: number) {
    this._project_application_renewal_credits = value;
  }

  get is_only_extra_credits_application(): boolean {
    return this._is_only_extra_credits_application;
  }

  set is_only_extra_credits_application(value: boolean) {
    this._is_only_extra_credits_application = value;
  }

  get project_application_cloud_service_user_number(): number {
    return this._project_application_cloud_service_user_number;
  }

  set project_application_cloud_service_user_number(value: number) {
    this._project_application_cloud_service_user_number = value;
  }
}
