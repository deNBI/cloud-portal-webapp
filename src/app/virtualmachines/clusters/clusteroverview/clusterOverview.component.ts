import {Component, OnDestroy, OnInit} from '@angular/core';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {FullLayoutComponent} from '../../../layouts/full-layout.component';
import {UserService} from '../../../api-connector/user.service';
import {ImageService} from '../../../api-connector/image.service';
import {FacilityService} from '../../../api-connector/facility.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {is_vo} from '../../../shared/globalvar';
import {VirtualMachineStates} from '../../virtualmachinemodels/virtualmachinestates';
import {GroupService} from '../../../api-connector/group.service';
import {ClientService} from '../../../api-connector/client.service';
import {Clusterinfo, WorkerBatch} from '../clusterinfo';
import {ClipboardService} from 'ngx-clipboard';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';
import {ApplicationRessourceUsage} from '../../../applications/application-ressource-usage/application-ressource-usage';
import {SCALE_SCRIPT_LINK} from '../../../../links/links';
import {AbstractBaseClasse} from '../../../shared/shared_modules/baseClass/abstract-base-class';
import {Flavor} from '../../virtualmachinemodels/flavor';
import {FlavorService} from '../../../api-connector/flavor.service';

export const SCALING_SCRIPT_NAME: string = 'scaling.py';

/**
 * Cluster overview componentn.
 */
@Component({
             selector: 'app-vm-overview',
             templateUrl: './clusterOverview.component.html',
             styleUrls: ['../../vmOverview.component.scss'],
             providers: [FacilityService, ImageService, UserService,
               VirtualmachineService, FullLayoutComponent, GroupService, ClientService, GroupService, FlavorService]
           })

export class ClusterOverviewComponent extends AbstractBaseClasse implements OnInit, OnDestroy {
  title: string = 'Cluster Overview';

  private subscription: Subscription = new Subscription();

  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

  cluster_content: Clusterinfo[] = [];
  show_connection_infO: boolean = false;
  currentPage: number = 1;
  DEBOUNCE_TIME: number = 300;
  FILTER_DEBOUNCE_TIME: number = 2000;
  SCALING_SCRIPT_LINK: string = SCALE_SCRIPT_LINK;
  selectedProjectRessources: ApplicationRessourceUsage;

  isSearching: boolean = true;
  scaling_warning_read: boolean = false;
  max_scale_count: number = 0;
  max_scale_count_loaded: boolean = false;
  selectedBatch: WorkerBatch;
  scale_worker_count: number;
  scale_down_count: number = 0;
  scaling_up: boolean = false;
  scaling_down: boolean = false;
  created_new_batch: boolean = false;
  selectedCluster: Clusterinfo = null;
  ressourceUsage: ApplicationRessourceUsage;
  projectDataLoaded: boolean = false;
  SCALING_SCRIPT_NAME: string = SCALING_SCRIPT_NAME;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  filter: string;
  cluster_per_site: number = 7;
  total_pages: number;
  total_items: number;
  clusters: Clusterinfo[] = [];
  /**
   * If user is vo admin.
   */

  items_per_page: number = 7;

  is_vo_admin: boolean;
  flavors: Flavor[] = []
  flavors_usable: Flavor[] = [];
  flavors_loaded: boolean = false;

  /**
   * Tab which is shown own|all.
   * @type {string}
   */
  tab: string = 'own';

  is_facility_manager: boolean = false;

  /**
   * Timeout for checking vm status.
   * @type {number}
   */
  private checkStatusTimeout: number = 5000;

  clusterPerPageChange: Subject<number> = new Subject<number>();

  filterChanged: Subject<string> = new Subject<string>();
  STATIC_IMG_FOLDER: String = 'static/webapp/assets/img/';

  constructor(private facilityService: FacilityService, private groupService: GroupService,
              private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService, private fb: FormBuilder,
              private clipboardService: ClipboardService, private flavorService: FlavorService
  ) {
    super();

  }

  /**
   * Apply filter to all vms.
   */
  applyFilter(): void {
    this.isSearching = true;
    if (typeof (this.cluster_per_site) !== 'number' || this.cluster_per_site <= 0) {
      this.cluster_per_site = 7;
    }
    if (this.tab === 'own') {
      this.getClusters()
    } else if (this.tab === 'all') {
      this.getAllClusters()
    } else if (this.tab === 'facility') {
      this.getAllCLusterFacilities()
    }

  }

  createNewBatchSelectedCluster(): void {
    this.created_new_batch = true;
    this.selectedCluster.create_new_batch()
    this.selectedBatch = this.selectedCluster.worker_batches[this.selectedCluster.worker_batches.length - 1]
    this.loadProjectRessource()
  }

  removeNewBatchSelectedCluster(): void {
    if (this.created_new_batch && this.selectedBatch) {
      this.selectedCluster.remove_batch(this.selectedBatch)
      this.created_new_batch = false;
      this.selectedBatch = null;
    }
  }

  setSelectedBatch(batch: WorkerBatch): void {

    this.selectedBatch = batch;
  }

  calcRess(): void {
    this.max_scale_count_loaded = false;

    // tslint:disable-next-line:max-line-length
    this.groupService.getGroupResources(this.selectedCluster.master_instance.projectid.toString()).subscribe((res: ApplicationRessourceUsage): void => {
      this.ressourceUsage = new ApplicationRessourceUsage(res);

      this.selectedCluster.worker_batches.forEach((batch: WorkerBatch): void => {
        batch.max_scale_up_count = this.ressourceUsage.calcMaxScaleUpWorkerInstancesByFlavor(batch.flavor)

      })

      this.max_scale_count_loaded = true;
    });
  }

  scaleUpCluster(): void {
    const scale_up_count: number = this.selectedBatch.upscale_count
    this.updateNotificationModal('Upscaling Cluster', `Starting ${scale_up_count} additional workers..`, true, 'info')

    if (!this.created_new_batch) {
      this.virtualmachineservice.scaleCluster(this.selectedCluster.cluster_id, this.selectedBatch).subscribe((): void => {
        this.selectedBatch.setNewScalingUpWorkerCount()

        this.check_worker_count_loop(this.selectedCluster)
        this.updateNotificationModal('Sucessfull',
                                     `The start of ${scale_up_count} workers was successfully initiated. Remember to configure your cluster after the machines are active!'`,
                                     true, 'success')

      })
    } else {
      this.virtualmachineservice.scaleClusterNewBatch(this.selectedCluster.cluster_id, this.selectedBatch).subscribe((): void => {

        this.selectedBatch.setNewScalingUpWorkerCount()

        this.check_worker_count_loop(this.selectedCluster)
        this.updateNotificationModal('Sucessfull',
                                     `The start of ${scale_up_count} workers was successfully initiated. Remember to configure your cluster after the machines are active!'`,
                                     true, 'success')

      })

    }
  }

  checkUpCount(batch: WorkerBatch): void {
    if (batch.upscale_count > batch.max_scale_up_count) {
      batch.upscale_count = batch.max_scale_up_count
    }

  }

  checkDelCount(batch: WorkerBatch): void {
    if (batch.delete_count > batch.worker_count) {
      batch.delete_count = batch.worker_count
    }
    this.scale_down_count = 0;

    this.selectedCluster.worker_batches.forEach((bat: WorkerBatch): void => {
      if (bat.delete_count > 0) {
        this.scale_down_count += bat.delete_count
      }

    })
  }

  calcMaxWorkerInstancesByFlavor(): void {
    if (this.selectedBatch.flavor) {

      this.selectedBatch.max_worker_count = this.selectedProjectRessources.calcMaxWorkerInstancesByFlavor(
        this.selectedCluster.master_instance.flavor,
        this.selectedBatch, this.selectedCluster.worker_batches)
    }
  }

  resizeFix(): void {
    window.dispatchEvent(new Event('resize'));
  }

  getFlavors(project_id: number | string): void {
    this.flavorService.getFlavors(project_id).subscribe((flavors: Flavor[]): void => {
      this.flavors = flavors;
      this.checkFlavorsUsableForCluster();
    });

  }

  checkFlavorsUsableForCluster(): void {
    const used_flavors: Flavor[] = []
    let flavors_to_filter: Flavor[] = []

    // tslint:disable-next-line:no-for-each-push
    this.selectedCluster.worker_batches.forEach((batch: WorkerBatch): void => {
      if (batch.flavor) {
        used_flavors.push(batch.flavor)
      }

    })
    if (used_flavors.length > 0) {
      flavors_to_filter = this.flavors.filter((flavor: Flavor): boolean => {
        let not_used: boolean = true;

        used_flavors.forEach((used_flavor: Flavor): void => {

          if (flavor.name === used_flavor.name) {
            not_used = false
          }
        })

        return not_used
      })
    } else {
      flavors_to_filter = this.flavors
    }
    this.flavors_usable = flavors_to_filter.filter((flav: Flavor): boolean => {

      return this.selectedProjectRessources.filterFlavorsTest(flav, flavors_to_filter, this.selectedCluster.worker_batches)
    });

    this.flavors_loaded = true;

  }

  loadProjectRessource(): void {
    this.projectDataLoaded = false;
    this.flavors = [];
    this.groupService.getGroupResources(this.selectedCluster.project_id).subscribe((res: ApplicationRessourceUsage): void => {
      this.selectedProjectRessources = new ApplicationRessourceUsage(res);
      this.getFlavors(this.selectedCluster.project_id);
      this.projectDataLoaded = true;

    });

  }

  resetScaling(): void {
    this.removeNewBatchSelectedCluster()
    this.selectedBatch = null;
    this.resetNotificationModal()
    this.scale_down_count = 0;
    this.scaling_warning_read = false;
    this.resetScaleCount()
  }

  scaleDown(): void {
    this.resetNotificationModal()

    const scale_down_batches: WorkerBatch[] = [];
    this.selectedCluster.worker_batches.forEach((batch: WorkerBatch): void => {
      if (batch.delete_count > 0) {
        scale_down_batches.push(batch)
      }
    })
    let msg: string = `Scaling Down Batches: `
    for (const batch of scale_down_batches) {
      msg += ` \n[Batch ${batch.index} by ${batch.delete_count} instances ]`
    }

    this.updateNotificationModal('Scaling Down', msg, true, 'info')

    this.virtualmachineservice.scaleDownCluster(this.selectedCluster.cluster_id, scale_down_batches).subscribe((): void => {
      this.selectedCluster.setScaleDownBatchesCount()

      msg = 'Successfully scaled down the batches. Remember to configure your cluster!';
      this.updateNotificationModal('Successfully Deleted!', msg, true, 'success')
    })

  }

  resetScaleCount(): void {
    this.selectedCluster.worker_batches.forEach((batch: WorkerBatch): void => {
      batch.delete_count = 0;
      batch.upscale_count = 0;
    })
  }

  copyToClipboard(text: string): void {
    if (this.clipboardService.isSupported) {
      this.clipboardService.copy(text);
    }
  }

  get_is_facility_manager(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      if (result.length > 0) {
        this.is_facility_manager = true;
      }
    })
  }

  /**
   * Toggle tab own|all.
   * @param {string} tabString
   */
  toggleTab(tabString: string): void {
    this.tab = tabString;
  }

  /**
   * Delete VM.
   * @param cluster
   */
  deleteCluster(cluster: Clusterinfo): void {
    cluster.status = VirtualMachineStates.DELETING;
    this.subscription.add(this.virtualmachineservice.deleteCluster(cluster.cluster_id).subscribe((): void => {
      cluster.status = VirtualMachineStates.DELETED

    }))
  }

  check_worker_count_loop(cluster: Clusterinfo): void {

    setTimeout(
      (): void => {

        // tslint:disable-next-line:max-line-length
        this.subscription.add(this.virtualmachineservice.getClusterInfo(cluster.cluster_id).subscribe((updated_cluster: Clusterinfo): void => {
          let stop_loop: boolean = true;
          const idx: number = this.clusters.indexOf(cluster)

          this.clusters[idx] = new Clusterinfo(updated_cluster);
          if (cluster === this.selectedCluster) {
            this.selectedCluster === this.clusters[idx]
          }
          cluster = this.clusters[idx]

          // tslint:disable-next-line:max-line-length
          for (const batch of cluster.worker_batches) {
            if (batch.running_worker < batch.worker_count) {
              stop_loop = false;
              break
            }
          }

          if (!stop_loop) {
            this.check_worker_count_loop(cluster)

          }

        }));

      },

      this.checkStatusTimeout
    );
  }

  check_status_loop(cluster: Clusterinfo, final_state?: string, is_selected_cluster?: boolean): void {

    setTimeout(
      (): void => {

        // tslint:disable-next-line:max-line-length
        this.subscription.add(this.virtualmachineservice.getClusterInfo(cluster.cluster_id).subscribe((updated_cluster: Clusterinfo): void => {
          this.clusters[this.clusters.indexOf(cluster)] = new Clusterinfo(updated_cluster);
          if (is_selected_cluster) {
            this.selectedCluster = updated_cluster;
          }

          // tslint:disable-next-line:max-line-length
          if (updated_cluster.status !== 'Running' && updated_cluster.status !== VirtualMachineStates.DELETING && updated_cluster.status !== VirtualMachineStates.DELETED) {
            this.check_status_loop(updated_cluster, final_state, is_selected_cluster)

          } else {

            let stop_loop: boolean = true;
            for (const batch of cluster.worker_batches) {
              if (batch.running_worker < batch.worker_count) {
                stop_loop = false;
                break
              }
            }
            if (!stop_loop) {
              this.check_worker_count_loop(cluster)

            }
          }

        }));

      },

      this.checkStatusTimeout
    );
  }

  /**
   * Load vms depending on page.
   * @param event
   */
  pageChanged(event: any): void {
    this.isSearching = true;

    this.currentPage = event.page;
    if (this.tab === 'own') {
      this.getClusters()
    } else if (this.tab === 'all') {
      this.getAllClusters()
    } else if (this.tab === 'facility') {
      this.getAllCLusterFacilities()
    }
  }

  /**
   * Get all vms of user.
   */
  getClusters(): void {

    this.virtualmachineservice.getClusters(
      this.currentPage, this.cluster_per_site,
      this.filter)
      .subscribe((cluster_page_infos: any[]): void => {
                   this.prepareClusters(cluster_page_infos)
                 }
      );
  }

  getAllCLusterFacilities(): void {

    this.virtualmachineservice.getVmsFromFacilitiesOfLoggedUser(
      this.selectedFacility['FacilityId'],
      this.currentPage, this.cluster_per_site,
      this.filter)
      .subscribe((cluster_page_infos: any[]): void => {
                   this.prepareClusters(cluster_page_infos)
                 }
      );

  }

  prepareClusters(cluster_page_infos: any): void {

    this.clusters = cluster_page_infos['cluster_list'].map((cluster: Clusterinfo): Clusterinfo => {
      return new Clusterinfo(cluster)
    })
    this.total_items = cluster_page_infos['total_items'];
    this.items_per_page = cluster_page_infos['items_per_page'];
    this.total_pages = cluster_page_infos['num_pages'];

    this.isSearching = false;
    this.checkClustersTillRunning()
  }

  checkClustersTillRunning(): void {
    this.clusters.forEach((cluster: Clusterinfo): void => {

      if (cluster.status !== 'Running') {
        this.check_status_loop(cluster);
      } else {
        this.check_worker_count_loop(cluster)
      }
    })
  }

  getAllClusters(): void {
    this.virtualmachineservice.getAllVM(this.currentPage, this.cluster_per_site,
                                        this.filter)
      .subscribe((cluster_page_infos: any[]): void => {
                   this.prepareClusters(cluster_page_infos)
                 }
      );
  }

  ngOnInit(): void {
    this.getClusters();
    this.is_vo_admin = is_vo;
    this.get_is_facility_manager();
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

    this.filterChanged
      .pipe(
        debounceTime(this.FILTER_DEBOUNCE_TIME),
        distinctUntilChanged())
      .subscribe((): void => {
        this.applyFilter();
      });

    this.clusterPerPageChange.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe((): void => {
        this.applyFilter();
      });

  }

  check_status_loop_vm(vm: VirtualMachine, cluster: Clusterinfo, final_state: string = VirtualMachineStates.ACTIVE): void {

    setTimeout(
      (): void => {
        this.subscription.add(
          this.virtualmachineservice.checkVmStatus(vm.openstackid, vm.name).subscribe((updated_vm: VirtualMachine): void => {
            updated_vm = new VirtualMachine(updated_vm);
            cluster.worker_instances[cluster.worker_instances.indexOf(vm)] = updated_vm;
            if (VirtualMachineStates.IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {
              this.check_status_loop_vm(updated_vm, cluster, final_state)
            } else if (VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(updated_vm.status) !== -1) {

              if (final_state && updated_vm.status !== final_state) {
                this.check_status_loop_vm(updated_vm, cluster, final_state)

              } else {
                this.check_status_loop_vm(updated_vm, cluster, final_state)
              }

            } else {
              this.check_worker_count_loop(cluster)
            }

          }))
      },

      this.checkStatusTimeout
    );
  }

  check_status_loop_cluster_vms(): void {
    this.clusters.forEach((cluster: Clusterinfo): void => {
      cluster.worker_instances.forEach((vm: VirtualMachine): void => {
        if (vm.status !== VirtualMachineStates.ACTIVE && VirtualMachineStates.NOT_IN_PROCESS_STATES.indexOf(vm.status) === -1) {
          this.check_status_loop_vm(vm, cluster)
        }
      })
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
