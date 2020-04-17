import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../../api-connector/group.service';
import {ImageService} from '../../../api-connector/image.service';
import {KeyService} from '../../../api-connector/key.service';
import {FlavorService} from '../../../api-connector/flavor.service';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {ApplicationsService} from '../../../api-connector/applications.service';
import {Application} from '../../../applications/application.model/application.model';
import {ApiSettings} from '../../../api-connector/api-settings.service';
import {ClientService} from '../../../api-connector/client.service';
import {UserService} from '../../../api-connector/user.service';
import {VoService} from '../../../api-connector/vo.service';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';
import {Image} from '../../virtualmachinemodels/image';
import {IResponseTemplate} from '../../../api-connector/response-template';
import {Flavor} from '../../virtualmachinemodels/flavor';
import {Userinfo} from '../../../userinfo/userinfo.model';
import {Client} from '../../clients/client.model';
import {BiocondaComponent} from '../../conda/bioconda.component';
import {forkJoin} from 'rxjs';
import {Clusterinfo} from '../clusterinfo';
import {Router} from '@angular/router';

/**
 * Cluster Component
 */
@Component({
             selector: 'app-add-cluster',
             templateUrl: './add-cluster.component.html',
             styleUrls: ['./add-cluster.component.scss'],
             providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService, ApplicationsService,
               Application, ApiSettings, KeyService, ClientService, UserService, VoService]
           })
export class AddClusterComponent implements OnInit {

  ACTIVE: string = 'ACTIVE';
  PLAYBOOK_FAILED: string = 'PLAYBOOK_FAILED';
  DELETED: string = 'DELETED';
  PORT_CLOSED: string = 'PORT_CLOSED';
  PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
  BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK';
  CREATING_STATUS: string = 'Creating...';
  BUILD_STATUS: string = 'Building..';
  CHECKING_PORT_STATUS: string = 'Checking port..';
  PREPARE_PLAYBOOK_STATUS: string = 'Prepare Playbook Build...';
  BUIDLING_PLAYBOOK_STATUS: string = 'Building Playbook...';
  ANIMATED_PROGRESS_BAR: string = 'progress-bar-animated';

  newVm: VirtualMachine = null;
  progress_bar_status: string = 'Creating..';
  progress_bar_animated: string = 'progress-bar-animated';
  progress_bar_width: number = 0;
  http_allowed: boolean = false;
  https_allowed: boolean = false;
  udp_allowed: boolean = false;
  is_vo: boolean = false;
  hasTools: boolean = false;
  gaveOkay: boolean = false;
  client_checked: boolean = false;
  timeout: number = 0;

  title: string = 'New Cluster';

  cluster_info: Clusterinfo;

  /**
   * All image of a project.
   */
  images: Image[];

  flavors_loaded: boolean = false;

  create_error: IResponseTemplate;

  /**
   * All flavors of a project.
   */
  flavors: Flavor[] = [];

  flavors_usable: Flavor[] = [];

  cluster_id: string;
  cluster_error: string;
  cluster_started: boolean = false;

  /**
   * Selected Image.
   */
  selectedImage: Image;
  selectedMasterImage: Image;
  selectedWorkerImage: Image;
  maxWorkerInstances: number;

  /**
   * Selected Flavor.
   */
  selectedMasterFlavor: Flavor;
  selectedFlavor: Flavor;
  selectedWorkerFlavor: Flavor;

  workerInstancesCount: number;

  /**
   * Userinfo from the user.
   */
  userinfo: Userinfo;

  /**
   * Selected Project vms client.
   */
  selectedProjectClient: Client;

  /**
   * Selected Project volumeStorage max.
   */
  selectedProjectDiskspaceMax: number;

  /**
   * Selected Project volumeStorage used.
   */
  selectedProjectDiskspaceUsed: number;

  /**
   * Selected Project volumes max.
   */
  selectedProjectVolumesMax: number;

  /**
   * Selected Project volumes used.
   */
  selectedProjectVolumesUsed: number;

  selectedProjectCoresUsed: number;

  selectedProjectCoresMax: number;

  selectedProjectRamMax: number;

  selectedProjectRamUsed: number;

  /**
   * Selected Project vms max.
   */
  selectedProjectVmsMax: number;

  /**
   * Selected Project vms used.
   */
  selectedProjectVmsUsed: number;

  selectedProjectGPUsUsed: number;
  selectedProjectGPUsMax: number;

  /**
   * The selected project ['name',id].
   */
  selectedProject: [string, number];

  /**
   * If the client for a project is viable.
   */
  client_avaiable: boolean = false;

  /**
   * Default volume name.
   * @type {string}
   */
  volumeName: string = '';

  /**
   * Default volumeStorage.
   * @type {number}
   */
  diskspace: number = 0;

  /**
   * If the data for the site is initialized.
   * @type {boolean}
   */
  isLoaded: boolean = false;

  /**
   * All projects of the user.
   * @type {any[]}
   */
  projects: string[] = [];

  /**
   * If all project data is loaded.
   * @type {boolean}
   */
  projectDataLoaded: boolean = false;

  newCores: number = 0;
  newRam: number = 0;
  newVms: number = 2;
  newGpus: number = 0;

  /**
   * Time for the check status loop.
   * @type {number}
   */
  private checkStatusTimeout: number = 5000;

  @ViewChild('bioconda', { static: false }) biocondaComponent: BiocondaComponent;

  constructor(private groupService: GroupService, private imageService: ImageService,
              private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
              private keyservice: KeyService, private userservice: UserService,
              private voService: VoService, private router: Router) {
  }

  changeCount(): void {
    this.newVms = Number(this.workerInstancesCount) + Number(1);
  }

  checkFlavorsUsableForCluster(): void {
    this.flavors_usable = this.flavors.filter((flav: Flavor) => {
      return this.filterFlavorsTest(flav)
    });

    this.flavors_loaded = true;

  }

  filterFlavorsTest(flavor: Flavor): boolean {
    const tmp_flavors: Flavor[] = [];
    const available_cores: number = this.selectedProjectCoresMax - (flavor.vcpus + this.selectedProjectCoresUsed);
    const available_ram: number = this.selectedProjectRamMax - (flavor.ram / 1024 + this.selectedProjectRamUsed);
    const available_gpu: number = this.selectedProjectGPUsMax - (flavor.gpu + this.selectedProjectGPUsUsed);
    console.log(flavor.name, available_cores, available_ram, available_gpu)
    for (const fl of this.flavors) {
      if (fl.vcpus <= available_cores && (fl.ram / 1024) <= available_ram && fl.gpu <= available_gpu) {
        tmp_flavors.push(fl)
      }
    }

    return tmp_flavors.length > 0;
  }

  filterFlavors(): void {
    const tmp_flavors: Flavor[] = [];
    const available_cores: number = this.selectedProjectCoresMax - (this.newCores + this.selectedProjectCoresUsed);
    const available_ram: number = this.selectedProjectRamMax - (this.newRam + this.selectedProjectRamUsed);
    const available_gpu: number = this.selectedProjectGPUsMax - (this.newGpus + this.selectedProjectGPUsUsed);
    for (const fl of this.flavors) {
      if (fl.vcpus <= available_cores && (fl.ram / 1024) <= available_ram && fl.gpu <= available_gpu) {
        tmp_flavors.push(fl)
      }
    }
    this.flavors_usable = tmp_flavors;
  }

  calcMaxWorkerInstancesByFlavor(): void {
    const ram_max_vms: number = (this.selectedProjectRamMax - this.selectedProjectRamUsed - (this.selectedMasterFlavor.ram / 1024))
      / (this.selectedWorkerFlavor.ram / 1024);
    const cpu_max_vms: number = (this.selectedProjectCoresMax - this.selectedProjectCoresUsed - this.selectedMasterFlavor.vcpus)
      / this.selectedWorkerFlavor.vcpus;

    this.maxWorkerInstances = Math.min(ram_max_vms, cpu_max_vms, this.selectedProjectVmsMax - this.selectedProjectVmsUsed - 1)
  }

  calculateNewValues(): void {
    console.log('test')
    let tmp_ram: number = 0;
    let tmp_cores: number = 0;
    let tmp_gpus: number = 0;
    if (this.selectedMasterFlavor) {
      tmp_ram += this.selectedMasterFlavor.ram;
      tmp_cores += this.selectedMasterFlavor.vcpus;
      tmp_gpus += this.selectedMasterFlavor.gpu;

    }
    if (this.selectedWorkerFlavor && this.workerInstancesCount) {
      tmp_ram += this.selectedWorkerFlavor.ram * this.workerInstancesCount;
      tmp_cores += this.selectedWorkerFlavor.vcpus * this.workerInstancesCount;
      tmp_gpus += this.selectedWorkerFlavor.gpu * this.workerInstancesCount;

    }
    this.newRam = tmp_ram / 1024;
    this.newCores = tmp_cores;
    this.newGpus = tmp_gpus;
    this.filterFlavors()
  }

  /**
   * Get images for the project.
   * @param {number} project_id
   */
  getImages(project_id: number): void {

    this.imageService.getImages(project_id).subscribe((images: Image[]) => {
      this.images = images;
      this.images.sort((x_cord: any, y_cord: any) => Number(x_cord.is_snapshot) - Number(y_cord.is_snapshot));
    });
  }

  /**
   * Get flavors for the project.
   * @param {number} project_id
   */
  getFlavors(project_id: number): void {
    this.flavorService.getFlavors(project_id).subscribe((flavors: Flavor[]) => {
      this.flavors = flavors;
      this.checkFlavorsUsableForCluster();
    });

  }

  /**
   * Validate the public key of the user.
   */
  validatePublicKey(): boolean {

    return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)

  }

  /**
   * Reset the progress bar.
   */
  resetProgressBar(): void {
    this.progress_bar_status = this.CREATING_STATUS;
    this.progress_bar_animated = this.ANIMATED_PROGRESS_BAR;
    this.progress_bar_width = 0;
  }

  checkClusterStatusLoop(): void {
    setTimeout(
      () => {
        this.virtualmachineservice.getClusterInfo(this.cluster_id).subscribe((cluster_info: Clusterinfo) => {
          this.cluster_info = cluster_info;
          if (this.cluster_info.status !== 'Running' && this.cluster_info.status !== 'Deleted') {
            this.checkClusterStatusLoop()
          } else {
            this.cluster_started = true;

          }

        })
      },
      this.checkStatusTimeout);
  }

  startCluster(): void {
    const re: RegExp = /\+/gi;
    this.cluster_error = null;
    this.cluster_id = null;

    const masterFlavor: string = this.selectedMasterFlavor.name.replace(re, '%2B');
    const workerFlavor: string = this.selectedWorkerFlavor.name.replace(re, '%2B');

    this.virtualmachineservice.startCluster(
      masterFlavor, this.selectedMasterImage,
      workerFlavor, this.selectedMasterImage,
      this.workerInstancesCount, this.selectedProject[1]).subscribe(
      (res: any) => {
        if (res['status'] && res['status'] === 'mutex_locked') {
          setTimeout(
            () => {
              this.startCluster()
            },
            1000)
        } else {
          this.router.navigate(['/virtualmachines/clusterOverview']).then().catch()

          this.cluster_id = res['id'];
        }

      }
      ,
      (error: any) => {
        console.log(error);
        this.cluster_error = error;
      })

  }

  /**
   * Get the client from the selected project.
   * If connected geht vm,volumes etc.
   */
  getSelectedProjectClient(): void {
    this.client_checked = false;
    this.projectDataLoaded = false;

    this.groupService.getClientBibigrid(this.selectedProject[1].toString()).subscribe((client: Client) => {
      if (client.status && client.status === 'Connected') {
        this.client_avaiable = true;

        this.loadProjectData();
        this.client_checked = true;
      } else {
        this.client_avaiable = false;
        this.client_checked = true;

      }
      this.selectedProjectClient = client;

    })
  }

  /**
   * Reset the data attribute.
   */
  resetData(): void {
    if (this.newVm === null) {
      return;
    }
    this.newVm = null;
  }

  /**
   * Initializes the data.
   * Gets all groups of the user and his key.
   */
  initializeData(): void {
    forkJoin(this.groupService.getSimpleVmByUser(), this.userservice.getUserInfo()).subscribe((result: any) => {
      this.userinfo = new Userinfo(result[1]);
      this.validatePublicKey();
      const membergroups: any = result[0];
      for (const project of membergroups) {
        this.projects.push(project);

      }
      this.isLoaded = true;
    })
  }

  loadProjectData(): void {
    this.projectDataLoaded = false;
    this.flavors = [];
    this.flavors_loaded = false;
    this.images = [];
    this.selectedImage = undefined;
    this.selectedFlavor = undefined;
    this.groupService.getGroupResources(this.selectedProject[1].toString()).subscribe((res: any) => {
      this.selectedProjectVmsMax = res['number_vms'];
      this.selectedProjectVmsUsed = res['used_vms'];
      this.selectedProjectDiskspaceMax = res['max_volume_storage'];
      this.selectedProjectDiskspaceUsed = res['used_volume_storage'];
      this.selectedProjectVolumesMax = res['volume_counter'];
      this.selectedProjectVolumesUsed = res['used_volumes'];
      this.selectedProjectCoresMax = res['cores_total'];
      this.selectedProjectCoresUsed = res['cores_used'];
      this.selectedProjectRamMax = res['ram_total'];
      this.selectedProjectRamUsed = res['ram_used'];
      this.selectedProjectGPUsMax = res['gpus_max'];
      this.selectedProjectGPUsUsed = res['gpus_used'];
      this.projectDataLoaded = true;

    });

    this.getImages(this.selectedProject[1]);
    this.getFlavors(this.selectedProject[1]);

  }

  setSelectedImage(image: Image): void {

    this.selectedImage = image;

  }

  resizeFix(): void {
    window.dispatchEvent(new Event('resize'));
  }

  ngOnInit(): void {

    this.initializeData();
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo = <boolean><Boolean>result.value;
    });

  }

  resetChecks(): void {
    this.gaveOkay = false;
    this.hasTools = false;
  }
}
