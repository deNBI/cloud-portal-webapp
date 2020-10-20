import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../../api-connector/group.service';
import {ImageService} from '../../../api-connector/image.service';
import {KeyService} from '../../../api-connector/key.service';
import {FlavorService} from '../../../api-connector/flavor.service';
import {VirtualmachineService} from '../../../api-connector/virtualmachine.service';
import {ApiSettings} from '../../../api-connector/api-settings.service';
import {ClientService} from '../../../api-connector/client.service';
import {UserService} from '../../../api-connector/user.service';
import {VoService} from '../../../api-connector/vo.service';
import {Image} from '../../virtualmachinemodels/image';
import {IResponseTemplate} from '../../../api-connector/response-template';
import {Flavor} from '../../virtualmachinemodels/flavor';
import {Userinfo} from '../../../userinfo/userinfo.model';
import {Client} from '../../../vo_manager/clients/client.model';
import {BiocondaComponent} from '../../conda/bioconda.component';
import {forkJoin} from 'rxjs';
import {Router} from '@angular/router';
import {ApplicationRessourceUsage} from '../../../applications/application-ressource-usage/application-ressource-usage';
import {WorkerBatch} from '../clusterinfo';

/**
 * Cluster Component
 */
@Component({
             selector: 'app-add-cluster',
             templateUrl: './add-cluster.component.html',
             styleUrls: ['./add-cluster.component.scss'],
             providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService
               , ApiSettings, KeyService, ClientService, UserService, VoService]
           })
export class AddClusterComponent implements OnInit {

  is_vo: boolean = false;

  client_checked: boolean = false;
  timeout: number = 0;
  title: string = 'New Cluster';

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
  selectedWorkerBatches: WorkerBatch[] = [new WorkerBatch(1)];
  selectedBatch: WorkerBatch = this.selectedWorkerBatches[0];

  maxWorkerInstances: number;

  /**
   * Selected Flavor.
   */
  selectedMasterFlavor: Flavor;
  selectedFlavor: Flavor;
  selectedWorkerFlavorSet: boolean = false;

  workerInstancesCount: number;

  /**
   * Userinfo from the user.
   */
  userinfo: Userinfo;

  /**
   * Selected Project vms client.
   */
  selectedProjectClient: Client;

  selectedProjectRessources: ApplicationRessourceUsage;

  /**
   * The selected project ['name',id].
   */
  selectedProject: [string, number];

  /**
   * If the client for a project is viable.
   */
  client_avaiable: boolean = false;

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

  @ViewChild('bioconda', {static: true}) biocondaComponent: BiocondaComponent;

  constructor(private groupService: GroupService, private imageService: ImageService,
              private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
              private keyservice: KeyService, private userservice: UserService,
              private voService: VoService, private router: Router) {
  }

  calcWorkerInstancesCount(): void {
    let count: number = 0;
    this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
      count += batch.count
    })
    this.workerInstancesCount = count;
    this.newVms = this.workerInstancesCount + 1;
  }

  changeCount(): void {

    this.calcWorkerInstancesCount()
    this.calculateNewValues()
  }

  checkFlavorsUsableForCluster(): void {
    const used_flavors: Flavor[] = []

    // tslint:disable-next-line:no-for-each-push
    this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
      if (batch !== this.selectedBatch) {
        used_flavors.push(batch.worker_flavor)
      }
    })
    const flavors_to_filter: Flavor[] = this.flavors.filter((flavor: Flavor): boolean => {
      return used_flavors.indexOf(flavor) < 0
    })
    this.flavors_usable = flavors_to_filter.filter((flav: Flavor): boolean => {

      return this.selectedProjectRessources.filterFlavorsTest(flav, flavors_to_filter, this.selectedWorkerBatches)
    });

    this.flavors_loaded = true;

  }

  filterFlavors(): void {

    this.flavors_usable = this.selectedProjectRessources.filterFlavors(
      this.newCores, this.newRam, this.newGpus, this.flavors, this.selectedWorkerBatches);
  }

  calcMaxWorkerInstancesByFlavor(flavor: Flavor): void {
    this.maxWorkerInstances = null;
    if (flavor) {

      this.maxWorkerInstances = this.selectedProjectRessources.calcMaxWorkerInstancesByFlavor(
        this.selectedMasterFlavor,
        flavor, this.selectedWorkerBatches)
    }
  }

  calculateNewValues(): void {
    let tmp_ram: number = 0;
    let tmp_cores: number = 0;
    let tmp_gpus: number = 0;
    if (this.selectedMasterFlavor) {
      tmp_ram += this.selectedMasterFlavor.ram;
      tmp_cores += this.selectedMasterFlavor.vcpus;
      tmp_gpus += this.selectedMasterFlavor.gpu;

    }
    this.selectedWorkerBatches.forEach((batch: WorkerBatch): void => {
      if (batch.count && batch.worker_flavor) {
        tmp_ram += batch.worker_flavor.ram * batch.count;
        tmp_cores += batch.worker_flavor.vcpus * batch.count;
        tmp_gpus += batch.worker_flavor.gpu * batch.count;
      }

    });

    this.newRam = Math.ceil(tmp_ram / 1024);
    this.newCores = tmp_cores;
    this.newGpus = tmp_gpus;
  }

  /**
   * Get images for the project.
   * @param {number} project_id
   */
  getImages(project_id: number): void {

    this.imageService.getImages(project_id).subscribe((images: Image[]): void => {
      this.images = images;
      this.images.sort((x_cord: any, y_cord: any): number => Number(x_cord.is_snapshot) - Number(y_cord.is_snapshot));
    });
  }

  /**
   * Get flavors for the project.
   * @param {number} project_id
   */
  getFlavors(project_id: number): void {
    this.flavorService.getFlavors(project_id).subscribe((flavors: Flavor[]): void => {
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

  addBatch(): void {
    this.selectedWorkerFlavorSet = false;
    this.selectedBatch = null;
    this.checkFlavorsUsableForCluster()
    const newBatch: WorkerBatch = new WorkerBatch(this.selectedWorkerBatches[this.selectedWorkerBatches.length - 1].index + 1)
    newBatch.worker_image = this.selectedMasterImage;
    this.maxWorkerInstances = null;
    this.selectedWorkerBatches.push(newBatch);
    this.selectedBatch = newBatch;
  }

  removeBatch(batch: WorkerBatch): void {
    const idx: number = this.selectedWorkerBatches.indexOf(batch)
    if (batch === this.selectedBatch) {
      this.maxWorkerInstances = null;
      if (idx !== 0) {
        this.selectedBatch = this.selectedWorkerBatches[idx - 1]
        this.selectedWorkerFlavorSet = true;

      } else {
        if (this.selectedWorkerBatches.length - 1 > 0) {
          this.selectedBatch = this.selectedWorkerBatches[idx + 1]
          this.selectedWorkerFlavorSet = true;

        } else {
          this.selectedBatch = null;
        }

      }
    }

    this.selectedWorkerBatches.splice(idx, 1)

    this.checkFlavorsUsableForCluster();
    this.calcWorkerInstancesCount();
    this.calculateNewValues();
    this.calcMaxWorkerInstancesByFlavor(this.selectedBatch.worker_flavor)

  }

  startCluster(): void {
    const re: RegExp = /\+/gi;
    this.cluster_error = null;
    this.cluster_id = null;

    const masterFlavor: string = this.selectedMasterFlavor.name.replace(re, '%2B');

    this.virtualmachineservice.startCluster(
      masterFlavor,
      this.selectedMasterImage,
      this.selectedWorkerBatches, this.selectedProject[1]).subscribe(
      (res: any): void => {
        if (res['status'] && res['status'] === 'mutex_locked') {
          setTimeout(
            (): void => {
              this.startCluster()
            },
            1000)
        } else {
          this.router.navigate(['/virtualmachines/clusterOverview']).then().catch()

          this.cluster_id = res['id'];
        }

      }
      ,
      (error: any): void => {
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

    this.groupService.getClientBibigrid(this.selectedProject[1].toString()).subscribe((client: Client): void => {
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
   * Initializes the data.
   * Gets all groups of the user and his key.
   */
  initializeData(): void {
    forkJoin(this.groupService.getSimpleVmByUser(), this.userservice.getUserInfo()).subscribe((result: any): void => {
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
    this.getImages(this.selectedProject[1]);

    this.groupService.getGroupResources(this.selectedProject[1].toString()).subscribe((res: ApplicationRessourceUsage): void => {
      this.selectedProjectRessources = new ApplicationRessourceUsage(res);
      this.getFlavors(this.selectedProject[1]);
      this.projectDataLoaded = true;

    });

  }

  resizeFix(): void {
    window.dispatchEvent(new Event('resize'));
  }

  ngOnInit(): void {

    this.initializeData();
    this.voService.isVo().subscribe((result: IResponseTemplate): void => {
      this.is_vo = <boolean><Boolean>result.value;
    });

  }

}
