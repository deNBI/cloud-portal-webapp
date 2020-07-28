import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationModification {

  private _Id: number;
  private _project_application_id: number | string;
  private _vms_requested: number;
  private _volume_limit: number;
  private _volume_counter: number;
  private _object_storage: number;
  private _comment: string;
  private _date_submitted: string;
  private _total_cores: number;
  private _total_ram: number;
  private _extra_credits: number;
  private _user: User;
  private _flavors: Flavor[] = [];
  private _cloud_service_develop: boolean = false;
  private _cloud_service_user_number: number;

  constructor(extension: ApplicationModification | null) {
    if (extension) {
      this._project_application_id = extension.project_application_id;
      this._cloud_service_develop = extension.cloud_service_develop;
      this._cloud_service_user_number = extension.cloud_service_user_number;
      this._vms_requested = extension.vms_requested;
      this._volume_limit = extension.volume_limit;
      this._volume_counter = extension.volume_counter;
      this._object_storage = extension.object_storage;
      this._comment = extension.comment;
      this._date_submitted = extension.date_submitted;
      this._total_cores = extension.total_cores;
      this._total_ram = extension.total_ram;
      this._extra_credits = extension.extra_credits;
      this._user = extension.user;
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
    this._total_cores = cores;
    this._total_ram = ram;
  }

  public getFlavorCounter(flavor: Flavor): number {
    if (this._flavors) {
      const flavs: Flavor[] = this._flavors.filter((fl: Flavor): boolean => {
        return fl.name === flavor.name
      });
      if (flavs.length > 0) {
        return flavs[0].counter
      }
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

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
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

  get total_cores(): number {
    return this._total_cores;
  }

  set total_cores(value: number) {
    this._total_cores = value;
  }

  get total_ram(): number {
    return this._total_ram;
  }

  set total_ram(value: number) {
    this._total_ram = value;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get comment(): string {
    return this._comment;
  }

  get vms_requested(): number {
    return this._vms_requested;
  }

  set vms_requested(value: number) {
    this._vms_requested = value;
  }

  get cloud_service_develop(): boolean {
    return this._cloud_service_develop;
  }

  set cloud_service_develop(value: boolean) {
    this._cloud_service_develop = value;
  }

  get cloud_service_user_number(): number {
    return this._cloud_service_user_number;
  }

  set cloud_service_user_number(value: number) {
    this._cloud_service_user_number = value;
  }

  get volume_limit(): number {
    return this._volume_limit;
  }

  set volume_limit(value: number) {
    this._volume_limit = value;
  }

  get volume_counter(): number {
    return this._volume_counter;
  }

  set volume_counter(value: number) {
    this._volume_counter = value;
  }

  get object_storage(): number {
    return this._object_storage;
  }

  set object_storage(value: number) {
    this._object_storage = value;
  }

  get date_submitted(): string {
    return this._date_submitted;
  }

  set date_submitted(value: string) {
    this._date_submitted = value;
  }

  get extra_credits(): number {
    return Number(this._extra_credits);
  }

  set extra_credits(value: number) {
    this._extra_credits = value;
  }

}
