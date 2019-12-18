import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment'
import {FlavorService} from "../api-connector/flavor.service";
import {ApplicationsService} from "../api-connector/applications.service";
import {FacilityService} from "../api-connector/facility.service";
import {VoService} from "../api-connector/vo.service";
import {UserService} from "../api-connector/user.service";
import {GroupService} from "../api-connector/group.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {CreditsService} from "../api-connector/credits.service";
import {AbstractBaseClasse} from "../shared/shared_modules/baseClass/abstract-base-class";
import {ActivatedRoute} from "@angular/router";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {Flavor} from "./virtualmachinemodels/flavor";
import {FlavorType} from "./virtualmachinemodels/flavorType";
import {Client} from "./clients/client.model";
import {ImageService} from "../api-connector/image.service";
import {Image} from "./virtualmachinemodels/image";
import {VirtualMachineStates} from "./virtualmachinemodels/virtualmachinestates";

@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  styleUrls: ['./vmdetail.component.scss'],
  providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService, VirtualmachineService, ImageService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id: string;
  virtualMachine: VirtualMachine;
  virtualmachineService: VirtualmachineService;
  userService: UserService;
  applicationService: ApplicationsService;
  title: string = 'Instance Detail';
  flavorService: FlavorService;
  imageService: ImageService;
  image: Image;
  startDate: number;
  stopDate: number;
  virtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

  constructor( private activatedRoute: ActivatedRoute,
               virtualmachineService: VirtualmachineService,
               userService: UserService,
               applicationService: ApplicationsService,
               flavorService: FlavorService,
               imageService: ImageService) {
    super();
    this.virtualmachineService = virtualmachineService;
    this.userService = userService;
    this.applicationService = applicationService;
    this.flavorService = flavorService;
    this.imageService = imageService;

  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe((paramsId: any) => {
     this.vm_id = paramsId.id;
     this.getVmById();

    });
  }

  getVmById(): void {
    this.virtualmachineService.getVmById(this.vm_id).subscribe(
      (aj: object) => {
        this.title = aj['name'];
        this.setNewVirtualMachine(aj);
        this.isLoaded = true;
      },
      (error: any) => {
          this.isLoaded = false;
      }
    );
  }

  setNewVirtualMachine(aj: any): void {
    const newVm: VirtualMachine = new VirtualMachine();
    newVm.name = aj['name'];
    newVm.application_id = aj['application_id'];
    newVm.created_at = aj['created_at'];
    newVm.elixir_id = aj['elixir_id'];
    newVm.openstackid = aj['openstackid'];
    newVm.project = aj['project'];
    newVm.ssh_command = aj['ssh_command'];
    newVm.status = aj['status'];
    newVm.username = aj['userlogin'];
    newVm.stopped_at = aj['stopped_at'];
    newVm.udp_command = aj['udp_command'];
    newVm.image = aj['image'];
    this.startDate = parseInt(newVm.created_at, 10) * 1000;
    this.stopDate = parseInt(newVm.stopped_at, 10) * 1000;
    this.image = this.createImage(aj['projectid'], newVm.image);
    newVm.flavor = this.createFlavor(aj['flavor']);
    newVm.client = this.createClient(aj['client']);
    this.virtualMachine = newVm;
  }

  createImage (project_id: number, name: string): Image {
    const newImage: Image = new Image();
    this.imageService.getImageByProjectAndName(project_id, name).subscribe(
      (bj: object) => {
        console.log(bj);
        newImage.description = bj['description'];
        newImage.is_snapshot = bj['is_snapshot'];
        newImage.name = bj['name'];
        newImage.logo_url = bj['logo_url'];
        newImage.id = bj['id'];
        newImage.tags = bj['tags'];
      },
      (error: any) => {
        this.isLoaded = false;
    }
    );

    return newImage;
  }

  createClient(aj: any): Client {

    const host: string = aj['host'];
    const port: string = aj['port'];
    const location: string = aj['location'];
    const id: string = aj['id'];
    const newClient: Client = new Client(host, port, location, id);
    newClient.status = aj['status'];
    newClient.version = aj['version'];

    return newClient;
  }

  createFlavor(aj: any): Flavor {

    const newFlavor: Flavor = new Flavor();
    newFlavor.comment = aj['comment'];
    newFlavor.epheremal_disk = aj['epheremal_disk'];
    newFlavor.gpu = aj['gpu'];
    newFlavor.id = aj['id'];
    newFlavor.name = aj['name'];
    newFlavor.ram = aj['ram'];
    newFlavor.rootdisk = aj['rootdisk'];
    newFlavor.simple_vm = aj['simple_vm']
    newFlavor.type = this.createFlavorType(aj['type']);
    newFlavor.vcpus = aj['vcpus'];

    return newFlavor;
  }

  createFlavorType (aj: any): FlavorType {
    const newFType: FlavorType = new FlavorType();
    newFType.descirption = aj['description'];
    newFType.shortcut = aj['shortcut'];
    newFType.long_name = aj['long_name'];

    return newFType;
  }

  copySSHCommand(): void {
    this.copyToClipboard(this.virtualMachine.ssh_command.substring(65, this.virtualMachine.ssh_command.length));
  }
  copyUDPCommand(): void {
    this.copyToClipboard(this.virtualMachine.udp_command);
  }

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  // vm actions

  checkStatus(vm: VirtualMachine): void {
    this.virtualmachineService.checkVmStatus(vm.openstackid)
      .subscribe((updated_vm: VirtualMachine) => {

          if (updated_vm.created_at !== '') {
            updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
          }
        }
      )
  }

  deleteVm(vm: VirtualMachine): void {
    this.virtualmachineService.deleteVM(vm.openstackid).subscribe((updated_vm: VirtualMachine) => {

      if (updated_vm.created_at !== '') {
        updated_vm.created_at = new Date(parseInt(updated_vm.created_at, 10) * 1000).toLocaleDateString();
      }
      this.virtualMachine = updated_vm;
      console.log('test');
    })
  }



}
