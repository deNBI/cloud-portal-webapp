import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';
import {WorkerBatch} from '../../virtualmachines/clusters/clusterinfo';

export class ApplicationRessourceUsage {
  number_vms: number;
  used_vms: number;
  max_volume_storage: number;
  used_volume_storage: number;
  volume_counter: number;
  used_volumes: number;
  cores_total: number;
  cores_used: number;
  ram_total: number;
  ram_used: number;
  gpus_max: number;
  gpus_used: number;

  constructor(usage: ApplicationRessourceUsage) {
    this.number_vms = usage.number_vms;
    this.used_vms = usage.used_vms;
    this.max_volume_storage = usage.max_volume_storage;
    this.used_volume_storage = usage.used_volume_storage;
    this.volume_counter = usage.volume_counter;
    this.used_volumes = usage.used_volumes;
    this.cores_total = usage.cores_total;
    this.cores_used = usage.cores_used;
    this.ram_total = usage.ram_total;
    this.ram_used = usage.ram_used;
    this.gpus_max = usage.gpus_max;
    this.gpus_used = usage.gpus_used;
  }

  filterFlavorsTest(flavor: Flavor, possible_flavors: Flavor[]): boolean {
    const tmp_flavors: Flavor[] = [];
    const available_cores: number = this.cores_total - (flavor.vcpus + this.cores_used);
    const available_ram: number = this.ram_total - (flavor.ram / 1024 + this.ram_used);
    const available_gpu: number = this.gpus_max - (flavor.gpu + this.gpus_used);
    for (const fl of possible_flavors) {
      if (fl.vcpus <= available_cores && (fl.ram / 1024) <= available_ram && fl.gpu <= available_gpu) {
        tmp_flavors.push(fl)
      }
    }

    return tmp_flavors.length > 0;
  }

  filterFlavors(new_cores: number, new_ram: number, new_gpus: number, possible_flavors: Flavor[]): Flavor[] {
    const tmp_flavors: Flavor[] = [];
    const available_cores: number = this.cores_total - (new_cores + this.cores_used);
    const available_ram: number = this.ram_total - (new_ram + this.ram_used);
    const available_gpu: number = this.gpus_max - (new_gpus + this.gpus_used);
    for (const fl of possible_flavors) {
      if (fl.vcpus <= available_cores && (fl.ram / 1024) <= available_ram && fl.gpu <= available_gpu) {
        tmp_flavors.push(fl)
      }
    }

    return tmp_flavors
  }

  calcMaxWorkerInstancesByFlavor(master_flavor: Flavor, worker_flavor: Flavor, worker_batches: WorkerBatch[]): number {
    let batches_ram: number = 0;
    let batches_cpu: number = 0;

    worker_batches.forEach((batch: WorkerBatch): void => {
      batches_ram += batch.worker_flavor.ram * batch.count / 1024;
      batches_cpu += batch.worker_flavor.vcpus * batch.count;
    });
    const ram_max_vms: number = (this.ram_total - this.ram_used - (master_flavor.ram / 1024) - batches_ram)
      / (worker_flavor.ram / 1024);
    const cpu_max_vms: number = (this.cores_total - this.cores_used - master_flavor.vcpus - batches_cpu)
      / worker_flavor.vcpus;

    return Math.floor(Math.min(ram_max_vms, cpu_max_vms, this.number_vms - this.used_vms - 1))
  }

  calcMaxScaleUpWorkerInstancesByFlavor(worker_flavor: Flavor): number {
    const ram_max_vms: number = (this.ram_total - this.ram_used)
      / (worker_flavor.ram / 1024);
    const cpu_max_vms: number = (this.cores_total - this.cores_used)
      / worker_flavor.vcpus;

    return Math.floor(Math.min(ram_max_vms, cpu_max_vms, this.number_vms - this.used_vms))
  }

}
