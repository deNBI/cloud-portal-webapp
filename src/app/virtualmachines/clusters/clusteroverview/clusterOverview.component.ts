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
import {Clusterinfo} from '../clusterinfo';
import {ClipboardService} from 'ngx-clipboard';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';
import {ApplicationRessourceUsage} from '../../../applications/application-ressource-usage/application-ressource-usage';

/**
 * Cluster overview componentn.
 */
@Component({
             selector: 'app-vm-overview',
             templateUrl: './clusterOverview.component.html',
             styleUrls: ['../../vmOverview.component.scss'],
             providers: [FacilityService, ImageService, UserService,
               VirtualmachineService, FullLayoutComponent, GroupService, ClientService, GroupService]
           })

export class ClusterOverviewComponent implements OnInit, OnDestroy {
  title: string = 'Cluster Overview';

  private subscription: Subscription = new Subscription();

  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

  cluster_content: Clusterinfo[] = [];
  show_connection_infO: boolean = false;
  currentPage: number = 1;
  DEBOUNCE_TIME: number = 300;
  FILTER_DEBOUNCE_TIME: number = 2000;

  isSearching: boolean = true;
  scale_down_vms: VirtualMachine[] = []
  scaling_warning_read: boolean = false;

  selectedCluster: Clusterinfo = null;
  ressourceUsage: ApplicationRessourceUsage;

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
  virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

  constructor(private facilityService: FacilityService, private groupService: GroupService,
              private imageService: ImageService, private userservice: UserService,
              private virtualmachineservice: VirtualmachineService, private fb: FormBuilder,
              private clipboardService: ClipboardService
  ) {

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

  calcRess(): void {
    this.groupService.getGroupResources(this.selectedCluster.master_instance.projectid.toString()).subscribe((res: ApplicationRessourceUsage): void => {
      this.ressourceUsage = new ApplicationRessourceUsage(res);
      let count: number = this.ressourceUsage.calcMaxScaleUpWorkerInstancesByFlavor(this.selectedCluster.worker_instances[0].flavor)
      console.log(count)
    });
  }

  resetScaleDown(): void {
    this.scaling_warning_read = false;
    this.scale_down_vms = [];
  }

  setForScaleDown(vm: VirtualMachine): void {
    const idx: number = this.scale_down_vms.indexOf(vm)
    if (idx === -1) {
      this.scale_down_vms.push(vm)
    } else {
      this.scale_down_vms.splice(idx, 1)

    }
  }

  scaleDownDeleteVm(): void {
    this.scale_down_vms.forEach((vm: VirtualMachine): void => {
      this.deleteVm(vm)
    })
  }

  deleteVm(vm: VirtualMachine): void {
    this.virtualmachineservice.deleteVM(vm.openstackid).subscribe(
      (updated_vm: VirtualMachine): void => {
        const idx: number = this.selectedCluster.worker_instances.indexOf(vm)
        if (idx !== -1) {
          this.selectedCluster.worker_instances[idx] = updated_vm
        }

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

  check_status_loop(cluster: Clusterinfo, final_state?: string, is_selected_cluster?: boolean): void {

    setTimeout(
      (): void => {

        // tslint:disable-next-line:max-line-length
        this.subscription.add(this.virtualmachineservice.getClusterInfo(cluster.cluster_id).subscribe((updated_cluster: Clusterinfo): void => {
          this.clusters[this.clusters.indexOf(cluster)] = updated_cluster;
          if (is_selected_cluster) {
            this.selectedCluster = updated_cluster;
          }

          if (updated_cluster.status !== 'Running' && updated_cluster.status !== 'DELETING') {
            this.check_status_loop(updated_cluster, final_state, is_selected_cluster)

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

    this.clusters = cluster_page_infos['cluster_list'];
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
