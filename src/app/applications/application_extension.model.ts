import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';

/**
 * Application Extension class.
 */
export class ApplicationExtension {

  private _Id: number;
  private _project_application_id: number | string;
  private _project_application_renewal_lifetime: number;
  private _project_application_renewal_vms_requested: number;
  private _project_application_renewal_volume_limit: number;
  private _project_application_renewal_volume_counter: number;
  private _project_application_renewal_object_storage: number;
  private _project_application_renewal_comment: string;
  private _project_application_renewal_date_submitted: string;
  private _project_application_renewal_total_cores: number;
  private _project_application_renewal_total_ram: number;
  private _project_application_renewal_credits: number;
  private _is_only_extra_credits_application: boolean;
  private _project_application_renewal_cloud_service_user_number: number;
  private _project_application_renewal_cloud_service_develop: boolean;
  private _flavors: Flavor[] = [];

  constructor(extension: ApplicationExtension|null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._project_application_renewal_lifetime = extension.project_application_renewal_lifetime;
      this._project_application_renewal_vms_requested = extension.project_application_renewal_vms_requested;
      this._project_application_renewal_volume_limit = extension.project_application_renewal_volume_limit;
      this._project_application_renewal_volume_counter = extension.project_application_renewal_volume_counter;
      this._project_application_renewal_object_storage = extension.project_application_renewal_object_storage;
      this._project_application_renewal_comment = extension.project_application_renewal_comment;
      this._project_application_renewal_date_submitted = extension.project_application_renewal_date_submitted;
      this._project_application_renewal_total_cores = extension.project_application_renewal_total_cores;
      this._project_application_renewal_total_ram = extension.project_application_renewal_total_ram;
      this._project_application_renewal_credits = extension.project_application_renewal_credits;
      this._is_only_extra_credits_application = extension.is_only_extra_credits_application;
      this._project_application_renewal_cloud_service_user_number = extension.project_application_renewal_cloud_service_user_number;
      this._project_application_renewal_cloud_service_develop = extension.project_application_renewal_cloud_service_develop;
      this._flavors = extension.flavors;
    }
  }

  public calculateRamCores(): void {
    let ram: number = 0;
    let cores: number = 0;
    for (const flavor of this._flavors) {
      ram += flavor.ram * flavor.counter;
      cores += flavor.vcpus * flavor.counter;

    }
    this._project_application_renewal_total_cores = cores;
    this._project_application_renewal_total_ram = ram;
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

  public setFlavorInFlavors(flavor: Flavor, counter: number): void {
    const idx: number = this._flavors.findIndex((fl: Flavor) => {
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
    this.calculateRamCores()
  }

  public addFlavorToRequested(flavor: Flavor): void {
    this._flavors.push(flavor)
  }

  get project_application_id(): number | string {
    return this._project_application_id;
  }

  set project_application_id(value: number | string) {
    this._project_application_id = value;
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

  get project_application_renewal_cloud_service_user_number(): number {
    return this._project_application_renewal_cloud_service_user_number;
  }

  set project_application_renewal_cloud_service_user_number(value: number) {
    this._project_application_renewal_cloud_service_user_number = value;
  }

  get project_application_renewal_cloud_service_develop(): boolean {
    return this._project_application_renewal_cloud_service_develop;
  }

  set project_application_renewal_cloud_service_develop(value: boolean) {
    this._project_application_renewal_cloud_service_develop = value;
  }
}
