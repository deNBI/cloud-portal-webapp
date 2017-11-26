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

@Component({
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers: [ImageService, FlavorService, VirtualmachineService, AuthzResolver, PerunSettings, MembersManager, ApiSettings]
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

  constructor(private imageService: ImageService, private  flavorService: FlavorService, private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private memberssmanager: MembersManager) {
  }


  getImages(): void {
    this.imageService.getImages().subscribe(images => this.images = images);
  }

  getFlavors(): void {
    this.flavorService.getFlavors().subscribe(flavors => this.flavors = flavors);

  }

  toggleInformationButton(): void {
    if (this.informationButton == "Show Information") {
      this.informationButton = "Hide Information";
    } else {
      this.informationButton = "Show Information";
    }

  }

  toggleInformationButton2(): void {
    if (this.informationButton2 == "Show Information") {
      this.informationButton2 = "Hide Information";
    } else {
      this.informationButton2 = "Show Information";
    }

  }

  startVM(flavor: string, image: string, servername: string): void {
    if (image && flavor && servername) {


      this.virtualmachineservice.startVM(flavor, image, "neu", servername, this.userinfo.FirstName + ' ' + this.userinfo.LastName, this.userinfo.ElxirId).subscribe(data => {
        console.log(data.text());
        this.data = data.text();
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

    })
    this.authzresolver.getPerunPrincipal().toPromise().then(result => {
      this.userinfo.ElxirId = result.json()['actor'];
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
    this.getImages();
    this.getFlavors();
    this.userinfo = new Userinfo();
    this.getUserinfo();


  }
}
