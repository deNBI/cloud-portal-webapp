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

@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService, VirtualmachineService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id: string;
  virtualMachine: VirtualMachine;
  virtualmachineService: VirtualmachineService;
  userService: UserService;
  applicationService: ApplicationsService;
  title: string = 'Instance Detail';
  flavorService: FlavorService;

  constructor( private activatedRoute: ActivatedRoute,
               virtualmachineService: VirtualmachineService,
               userService: UserService,
               applicationService: ApplicationsService,
               flavorService: FlavorService) {
    super();
    this.virtualmachineService = virtualmachineService;
    this.userService = userService;
    this.applicationService = applicationService;
    this.flavorService = flavorService;

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
    newVm.image = aj['image'];
    newVm.openstackid = aj['openstackid'];
    newVm.project = aj['project'];
    newVm.ssh_command = aj['ssh_command'];
    newVm.status = aj['status'];
    newVm.username = aj['userlogin'];
    newVm.stopped_at = aj['stopped_at'];
    newVm.udp_command = aj['udp_command'];
    newVm.flavor = this.createFlavor(aj['flavor']);
    newVm.client = this.createClient(aj['client']);
    this.virtualMachine = newVm;
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

    return newFlavor;
  }

  createFlavorType (aj: any): FlavorType {
    const newFType: FlavorType = new FlavorType();
    newFType.descirption = aj['description'];
    newFType.shortcut = aj['shortcut'];
    newFType.long_name = aj['long_name'];

    return newFType;
  }

}
