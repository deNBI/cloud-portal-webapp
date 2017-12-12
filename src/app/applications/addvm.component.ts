import {Component, OnInit, TemplateRef} from '@angular/core';
import {Image} from "../virtualmachinemodels/image";
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {Flavor} from '../virtualmachinemodels/flavor';
import {ImageService} from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {ImageDetailComponent} from "./imagedetail.component";
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {Metadata} from '../virtualmachinemodels/metadata';
import {VirtualmachineService} from "../api-connector/virtualmachine.service";

import {Userinfo} from "../userinfo/userinfo.model";
import {ApiSettings} from "../api-connector/api-settings.service";
import {MembersManager} from "../perun-connector/members-manager.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";
import {keyService} from "../api-connector/key.service";
import {ClientService} from "../api-connector/vmClients.service";
import {Vmclient} from "../virtualmachinemodels/vmclient";
import {GroupsManager} from "../perun-connector/groups-manager.service";
import {AttributesManager} from "../perun-connector/attributes-manager";

@Component({
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers: [ImageService, FlavorService, VirtualmachineService, AttributesManager, AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, ClientService, GroupsManager]
})
export class VirtualMachineComponent implements OnInit {
  data: string;
  informationButton: string = "Show Details";
  informationButton2: string = "Show Details";
  images: Image[];
  metadatalist: Metadata [] = [];
  flavors: Flavor[];
  selectedImage: Image;
  selectedFlavor: Flavor;
  userinfo: Userinfo;
  vmclient: Vmclient;
  selectedProject: string;
  memberprojects: {};

  constructor(private imageService: ImageService, private attributemanager: AttributesManager, private  flavorService: FlavorService, private groupsmanager: GroupsManager, private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private  keyservice: keyService, private clientservice: ClientService) {
  }


  getImages(): void {
    this.imageService.getImages(this.vmclient.host, this.vmclient.port).subscribe(images => this.images = images);
  }

  getFlavors(): void {
    this.flavorService.getFlavors(this.vmclient.host, this.vmclient.port).subscribe(flavors => this.flavors = flavors);

  }

  getClientData() {
    this.clientservice.getClientsChecked().subscribe(response => {
      this.getRRFirstClient();

    })
  }

  getRRFirstClient(): void {
    this.clientservice.getRRFirstClient().subscribe(client => {
        this.vmclient = client;
        this.getImages();
        this.getFlavors()
      }
    )
    ;
  }

  toggleInformationButton(): void {
    if (this.informationButton == "Show Details") {
      this.informationButton = "Hide Details";
    } else {
      this.informationButton = "Show Details";
    }

  }

  toggleInformationButton2(): void {
    if (this.informationButton2 == "Show Details") {
      this.informationButton2 = "Hide Details";
    } else {
      this.informationButton2 = "Show Details";
    }

  }

  getUserPublicKey() {
    this.keyservice.getKey(this.userinfo.ElxirId).subscribe(result => {
      this.userinfo.PublicKey = result.toString();
    })
  }

  startVM(flavor: string, image: string, servername: string, project: string): void {
    console.log(project);
    console.log(image);
    console.log(flavor);
    console.log(servername);
    if (image && flavor && servername && project) {


      this.virtualmachineservice.startVM(flavor, image, this.userinfo.PublicKey, servername, this.userinfo.FirstName + ' ' + this.userinfo.LastName, this.userinfo.ElxirId, this.vmclient.host, this.vmclient.port, project, this.userinfo.UserLogin).subscribe(data => {
        console.log(data.text());
        this.data = data.text();
        let datajson=data.json()
        try{
        if (datajson['floating_ip']){
          this.data="Server was started. You can acces it with command 'ssh -i private_key_file ubuntu@" + datajson['floating_ip'] + "'";
        }}
        catch (e) {

        }


        console.log(this.data);
        this.printData();

      });

    }
    else {
      this.data = "INVALID"
      console.log(this.data)
    }
  }

  printData(): void {
    console.log(this.data)
  }

  resetData(): void {
    if (this.data == 'INVALID') {
      return;
    }
    this.data = null;
  }

  resetData2(): void {
    this.data = null;
  }

  onSelectFlavor(flavor: Flavor): void {
    this.selectedFlavor = flavor;
  }

  onSelectImage(image: Image): void {
    this.selectedImage = image
  }

  checkMetadataKeys(key: string): boolean {
    for (let metadata of this.metadatalist) {
      if (metadata.key == key) {
        return false;
      }
    }
    return true;
  }

  getUserinfo() {
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => {
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.memberssmanager.getMemberByUser(res["id"]).toPromise();

      }).then(memberinfo => {
      this.userinfo.MemberId = memberinfo.json()["id"];
      this.groupsmanager.getMemberGroups(this.userinfo.MemberId).toPromise().then(membergroups => this.memberprojects = membergroups.json());
      console.log(this.memberprojects);
      this.attributemanager.getLogins(this.userinfo.Id).toPromise().then(result => {
        let logins = result.json()
        for (let login of logins) {
          if (login['friendlyName'] === 'login-namespace:elixir-persistent') {
            this.userinfo.ElxirId = login['value']
          }
          else if (login['friendlyName'] === 'login-namespace:elixir') {
            this.userinfo.UserLogin = login['value'];
            console.log(this.userinfo.UserLogin)

          }

        }

      });
    });
    this.authzresolver.getPerunPrincipal().toPromise().then(result => {
      this.userinfo.ElxirId = result.json()['actor'];
    }).then(result => {
      this.getUserPublicKey()

    });
  }

  addMetadataItem(key: string, value: string): void {
    if (key && value && this.checkMetadataKeys(key)) {
      this.metadatalist.push(new Metadata(key, value));
    }

  }

  deleteMetadataItem(metadata: Metadata): void {
    this.metadatalist.splice(this.metadatalist.indexOf(metadata), 1);
  }

  ngOnInit(): void {

    this.userinfo = new Userinfo();
    this.getUserinfo();
    this.getClientData()


  }
}
