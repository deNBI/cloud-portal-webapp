import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {User} from './application.model/application.model';

/**
 * Application Extension class.
 */
export class ApplicationModification {

  Id: number;
  project_application_id: number | string;
  vms_requested: number;
  volume_limit: number;
  volume_counter: number;
  object_storage: number;
  comment: string;
  date_submitted: string;
  total_cores: number;
  total_ram: number;
  extra_credits: number;
  user: User;
  flavors: Flavor[] = [];
  cloud_service_develop: boolean = false;
  cloud_service_user_number: number;

  constructor(extension: ApplicationModification | null) {
    if (extension) {
      this.project_application_id = extension.project_application_id;
      this.cloud_service_develop = extension.cloud_service_develop;
      this.cloud_service_user_number = extension.cloud_service_user_number;
      this.vms_requested = extension.vms_requested;
      this.volume_limit = extension.volume_limit;
      this.volume_counter = extension.volume_counter;
      this.object_storage = extension.object_storage;
      this.comment = extension.comment;
      this.date_submitted = extension.date_submitted;
      this.total_cores = extension.total_cores;
      this.total_ram = extension.total_ram;
      this.extra_credits = extension.extra_credits;
      this.user = extension.user;
      this.flavors = extension.flavors;
    }
  }

  public calculateRamCores(): void {
    let ram: number = 0;
    let cores: number = 0;
    for (const flavor of this.flavors) {
      ram += flavor.ram * flavor.counter;
      cores += flavor.vcpus * flavor.counter;

    }
    this.total_cores = cores;
    this.total_ram = ram;
  }

  public getFlavorCounter(flavor: Flavor): number {
    if (this.flavors) {
      const flavs: Flavor[] = this.flavors.filter((fl: Flavor): boolean => {
        return fl.name === flavor.name
      });
      if (flavs.length > 0) {
        return flavs[0].counter
      }
    }

    return 0
  }

  public setFlavorInFlavors(flavor: Flavor, counter: number): void {
    const idx: number = this.flavors.findIndex((fl: Flavor) => {
      return fl.name === flavor.name
    });
    if (idx !== -1) {
      if (counter > 0) {
        this.flavors[idx].counter = counter;
      } else {
        this.flavors.splice(idx, 1)
      }
    } else {
      if (counter > 0) {

        flavor.counter = counter;

        this.flavors.push(flavor)
      }
    }
    this.calculateRamCores()
  }
}
