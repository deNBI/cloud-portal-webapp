import ***REMOVED***Component, OnInit, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from './virtualmachinemodels/image';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';
import ***REMOVED***VirtualmachineService***REMOVED*** from '../api-connector/virtualmachine.service';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Userinfo***REMOVED*** from '../userinfo/userinfo.model';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***ClientService***REMOVED*** from '../api-connector/client.service';
import ***REMOVED***Application***REMOVED*** from '../applications/application.model';
import ***REMOVED***KeyService***REMOVED*** from '../api-connector/key.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***Client***REMOVED*** from './clients/client.model';
import ***REMOVED***VirtualMachine***REMOVED*** from './virtualmachinemodels/virtualmachine';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***BiocondaComponent***REMOVED*** from './conda/bioconda.component';

/**
 * Start virtualmachine component.
 */
@Component(***REMOVED***
             selector: 'app-new-vm',
             templateUrl: 'addvm.component.html',
             providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService, ApplicationsService,
               Application, ApiSettings, KeyService, ClientService, UserService, VoService]
           ***REMOVED***)
export class VirtualMachineComponent implements OnInit ***REMOVED***

  newVm: VirtualMachine = null;
  creating_vm_status: string = 'Creating..';
  creating_vm_prograss_bar: string = 'progress-bar-animated';
  checking_vm_status: string = '';
  checking_vm_status_width: number = 0;
  checking_vm_status_progress_bar: string = 'progress-bar-animated';
  checking_vm_ssh_port: string = '';
  checking_vm_ssh_port_width: number = 0;
  http_allowed: boolean = false;
  https_allowed: boolean = false;
  udp_allowed: boolean = false;
  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;
  is_vo: boolean = false;

  informationButton: string = 'Show Details';
  informationButton2: string = 'Show Details';
  client_checked: boolean = false;

  /**
   * All image of a project.
   */
  images: Image[];

  create_error: IResponseTemplate;

  /**
   * All flavors of a project.
   */
  flavors: Flavor[];

  /**
   * Selected Image.
   */
  selectedImage: Image;

  /**
   * Selected Flavor.
   */
  selectedFlavor: Flavor;

  /**
   * Userinfo from the user.
   */
  userinfo: Userinfo;

  /**
   * Selected Project vms client.
   */
  selectedProjectClient: Client;

  /**
   * Selected Project diskspace max.
   */
  selectedProjectDiskspaceMax: number;

  /**
   * Selected Project diskspace used.
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

  /**
   * The selected project ['name',id].
   */
  selectedProject: [string, number];

  /**
   * If the client for a project is viable.
   */
  client_avaiable: boolean = false;

  /**
   * If the public key is valid.
   */
  validPublickey: boolean;

  /**
   * Default volume name.
   * @type ***REMOVED***string***REMOVED***
   */
  volumeName: string = '';

  /**
   * If optional params are shown.
   * @type ***REMOVED***boolean***REMOVED***
   */
  optional_params: boolean = false;

  bioconda_show: boolean = false;

  /**
   * Default diskspace.
   * @type ***REMOVED***number***REMOVED***
   */
  diskspace: number = 0;

  /**
   * If the data for the site is initialized.
   * @type ***REMOVED***boolean***REMOVED***
   */
  isLoaded: boolean = false;

  /**
   * All projects of the user.
   * @type ***REMOVED***any[]***REMOVED***
   */
  projects: string[] = new Array();

  /**
   * If all project data is loaded.
   * @type ***REMOVED***boolean***REMOVED***
   */
  projectDataLoaded: boolean = false;

  /**
   * id of the freemium project.
   * @type ***REMOVED***number***REMOVED***
   */
  FREEMIUM_ID: number = environment.freemium_project_id;

  /**
   * Time for the check status loop.
   * @type ***REMOVED***number***REMOVED***
   */
  private checkStatusTimeout: number = 5000;

  @ViewChild('bioconda') biocondaComponent: BiocondaComponent;

  constructor(private groupService: GroupService, private imageService: ImageService,
              private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
              private keyservice: KeyService, private userservice: UserService,
              private voService: VoService) ***REMOVED***
  ***REMOVED***

  /**
   * Get images for the project.
   * @param ***REMOVED***number***REMOVED*** project_id
   */
  getImages(project_id: number): void ***REMOVED***

    this.imageService.getImages(project_id).subscribe(images => this.images = images);
  ***REMOVED***

  /**
   * Get flavors for the project.
   * @param ***REMOVED***number***REMOVED*** project_id
   */
  getFlavors(project_id: number): void ***REMOVED***
    this.flavorService.getFlavors(project_id).subscribe(flavors => this.flavors = flavors);

  ***REMOVED***

  /**
   * Validate the public key of the user.
   */
  validatePublicKey(): boolean ***REMOVED***

    return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)

  ***REMOVED***

  /**
   * Get the public key of the user.
   */
  getUserPublicKey(): void ***REMOVED***
    this.keyservice.getKey().subscribe((key: IResponseTemplate) => ***REMOVED***
      this.userinfo.PublicKey = <string>key.value;
    ***REMOVED***)
  ***REMOVED***

  /**
   * Toggle information button 1.
   */
  toggleInformationButton(): void ***REMOVED***
    if (this.informationButton === 'Show Details') ***REMOVED***
      this.informationButton = 'Hide Details';
    ***REMOVED*** else ***REMOVED***
      this.informationButton = 'Show Details';
    ***REMOVED***

  ***REMOVED***

  /**
   * Toggle information button 2.
   */
  toggleInformationButton2(): void ***REMOVED***
    if (this.informationButton2 === 'Show Details') ***REMOVED***
      this.informationButton2 = 'Hide Details';
    ***REMOVED*** else ***REMOVED***
      this.informationButton2 = 'Show Details';
    ***REMOVED***

  ***REMOVED***

  /**
   * Reset the progress bar.
   */
  resetProgressBar(): void ***REMOVED***
    this.creating_vm_status = 'Creating..';
    this.creating_vm_prograss_bar = 'progress-bar-animated';
    this.checking_vm_status = '';
    this.checking_vm_status_width = 0;
    this.checking_vm_status_progress_bar = 'progress-bar-animated';
    this.checking_vm_ssh_port = '';
    this.checking_vm_ssh_port_width = 0;
  ***REMOVED***

  /**
   * Check the status of the started vm in a loop.
   * @param ***REMOVED***string***REMOVED*** id
   */
  check_status_loop(id: string): void ***REMOVED***

    setTimeout(
      () => ***REMOVED***
        this.virtualmachineservice.checkVmStatus(id).subscribe((newVm: VirtualMachine) => ***REMOVED***
          if (newVm.status === 'ACTIVE') ***REMOVED***
            this.resetProgressBar();
            this.newVm = newVm;
            this.loadProjectData();

          ***REMOVED*** else if (newVm.status) ***REMOVED***
            if (newVm.status === 'PORT_CLOSED') ***REMOVED***
              this.checking_vm_status = 'Active';
              this.checking_vm_status_progress_bar = '';
              this.creating_vm_prograss_bar = '';
              this.checking_vm_ssh_port = 'Checking port..';
              this.checking_vm_ssh_port_width = 34;

            ***REMOVED***
            this.check_status_loop(id)
          ***REMOVED*** else ***REMOVED***
            this.resetProgressBar();
            this.create_error = <IResponseTemplate><any>newVm;
            this.loadProjectData();
          ***REMOVED***

        ***REMOVED***)
      ***REMOVED***,
      this.checkStatusTimeout);
  ***REMOVED***

  /**
   * Start a virtual machine with specific params.
   * @param ***REMOVED***string***REMOVED*** flavor
   * @param ***REMOVED***string***REMOVED*** image
   * @param ***REMOVED***string***REMOVED*** servername
   * @param ***REMOVED***string***REMOVED*** project
   * @param ***REMOVED***string***REMOVED*** projectid
   */
  startVM(flavor: string, image: string, servername: string, project: string, projectid: string | number): void ***REMOVED***
    this.create_error = null;
    if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) ***REMOVED***
      this.create_error = null;
      const re: RegExp = /\+/gi;

      const flavor_fixed: string = flavor.replace(re, '%2B');

      this.virtualmachineservice.startVM(
        flavor_fixed, image, servername, project, projectid.toString(), this.http_allowed, this.https_allowed, this.udp_allowed,
        this.volumeName, this.diskspace.toString(), this.biocondaComponent.getChosenTools()).subscribe((newVm: VirtualMachine) => ***REMOVED***

        if (newVm.status === 'Build') ***REMOVED***
          this.creating_vm_status = 'Created';
          this.creating_vm_prograss_bar = '';
          this.checking_vm_status = 'Checking status..';
          this.checking_vm_status_progress_bar = 'progress-bar-animated';
          this.checking_vm_status_width = 33;
          this.check_status_loop(newVm.openstackid);

        ***REMOVED*** else if (newVm.status) ***REMOVED***
          this.creating_vm_status = 'Creating';
          this.newVm = newVm;
          this.check_status_loop(newVm.openstackid);
        ***REMOVED*** else ***REMOVED***
          this.creating_vm_status = 'Creating';
          this.create_error = <IResponseTemplate><any>newVm;
        ***REMOVED***

      ***REMOVED***);

    ***REMOVED*** else ***REMOVED***
      this.creating_vm_status = 'Creating';

      this.newVm = null;

    ***REMOVED***
  ***REMOVED***

  /**
   * Get the client from the selected project.
   * If connected geht vm,volumes etc.
   * @param ***REMOVED***number***REMOVED*** groupid
   */
  getSelectedProjectClient(): void ***REMOVED***
    this.client_checked = false;
    this.projectDataLoaded = false;

    this.groupService.getClient(this.selectedProject[1].toString()).subscribe((client: Client) => ***REMOVED***
      if (client.status && client.status === 'Connected') ***REMOVED***
        this.client_avaiable = true;

        this.loadProjectData();
        this.client_checked = true;
      ***REMOVED*** else ***REMOVED***
        this.client_avaiable = false;
        this.client_checked = true;

      ***REMOVED***
      this.selectedProjectClient = client;

    ***REMOVED***)
  ***REMOVED***

  /**
   * Reset the data attribute.
   */
  resetData(): void ***REMOVED***
    if (this.newVm === null) ***REMOVED***
      return;
    ***REMOVED***
    this.newVm = null;
  ***REMOVED***

  /**
   * Initializes the data.
   * Gets all groups of the user and his key.
   */
  initializeData(): void ***REMOVED***
    forkJoin(this.groupService.getSimpleVmByUser(), this.userservice.getUserInfo()).subscribe(result => ***REMOVED***
      this.userinfo = new Userinfo(result[1]);
      this.validatePublicKey();
      const membergroups = result[0];
      for (const project of membergroups) ***REMOVED***
        this.projects.push(project);

      ***REMOVED***
      this.isLoaded = true;
    ***REMOVED***)
  ***REMOVED***

  loadProjectData(): void ***REMOVED***
    this.projectDataLoaded = false;
    this.groupService.getGroupResources(this.selectedProject[1].toString()).subscribe(res => ***REMOVED***
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
      this.projectDataLoaded = true;

    ***REMOVED***);

    this.getImages(this.selectedProject[1]);
    this.getFlavors(this.selectedProject[1]);

  ***REMOVED***

  /**
   * Get vms diskpace and used from the selected project.
   */
  getSelectedProjectDiskspace(): void ***REMOVED***
    forkJoin(
      this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()),
      this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => ***REMOVED***
      this.selectedProjectDiskspaceMax = <number>res[0].value;
      this.selectedProjectDiskspaceUsed = <number>res[1].value;
    ***REMOVED***)
  ***REMOVED***

  /**
   * Get volumes max and used from the selected project.
   */
  getSelectedProjectVolumes(): void ***REMOVED***
    forkJoin(
      this.groupService.getVolumeCounter(this.selectedProject[1].toString()),
      this.groupService.getVolumesUsed(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => ***REMOVED***
      this.selectedProjectVolumesMax = <number>res[0].value;
      this.selectedProjectVolumesUsed = <number>res[1].value;

    ***REMOVED***)
  ***REMOVED***

  /**
   * Get vms max and used from the selected project.
   */
  getSelectedProjectVms(): void ***REMOVED***
    forkJoin(
      this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()),
      this.groupService.getGroupUsedVms(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => ***REMOVED***
      this.selectedProjectVmsMax = <number>res[0].value;
      this.selectedProjectVmsUsed = <number>res[1].value

    ***REMOVED***)

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.initializeData();
    this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.is_vo = <boolean><Boolean>result.value;
    ***REMOVED***)
  ***REMOVED***
***REMOVED***
