import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from "../virtualmachinemodels/image";
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***Metadata***REMOVED*** from '../virtualmachinemodels/metadata';
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";

import ***REMOVED***Userinfo***REMOVED*** from "../userinfo/userinfo.model";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***MembersManager***REMOVED*** from "../perun-connector/members-manager.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachinemodels/vmclient";

@Component(***REMOVED***
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers: [ImageService, FlavorService, VirtualmachineService, AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, ClientService]
***REMOVED***)
export class VirtualMachineComponent implements OnInit ***REMOVED***
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

  constructor(private imageService: ImageService, private  flavorService: FlavorService, private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private  keyservice: keyService, private clientservice: ClientService) ***REMOVED***
  ***REMOVED***


  getImages(): void ***REMOVED***
    this.imageService.getImages(this.vmclient.host, this.vmclient.port).subscribe(images => this.images = images);
  ***REMOVED***

  getFlavors(): void ***REMOVED***
    this.flavorService.getFlavors(this.vmclient.host, this.vmclient.port).subscribe(flavors => this.flavors = flavors);

  ***REMOVED***

  getClientData() ***REMOVED***
    this.clientservice.getClientsChecked().subscribe(response => ***REMOVED***
      this.getRRFirstClient();

    ***REMOVED***)
  ***REMOVED***

  getRRFirstClient(): void ***REMOVED***
    this.clientservice.getRRFirstClient().subscribe(client =>***REMOVED***
      this.vmclient = client;
    this.getImages();
      this.getFlavors()***REMOVED***
    )
    ;
  ***REMOVED***

  toggleInformationButton(): void ***REMOVED***
    if (this.informationButton == "Show Information") ***REMOVED***
      this.informationButton = "Hide Information";
    ***REMOVED*** else ***REMOVED***
      this.informationButton = "Show Information";
    ***REMOVED***

  ***REMOVED***

  toggleInformationButton2(): void ***REMOVED***
    if (this.informationButton2 == "Show Information") ***REMOVED***
      this.informationButton2 = "Hide Information";
    ***REMOVED*** else ***REMOVED***
      this.informationButton2 = "Show Information";
    ***REMOVED***

  ***REMOVED***

  getUserPublicKey() ***REMOVED***
    this.keyservice.getKey(this.userinfo.ElxirId).subscribe(result => ***REMOVED***
      this.userinfo.PublicKey = result.toString();
    ***REMOVED***)
  ***REMOVED***

  startVM(flavor: string, image: string, servername: string): void ***REMOVED***
    if (image && flavor && servername) ***REMOVED***


      this.virtualmachineservice.startVM(flavor, image, this.userinfo.PublicKey, servername, this.userinfo.FirstName + ' ' + this.userinfo.LastName, this.userinfo.ElxirId, this.vmclient.host, this.vmclient.port).subscribe(data => ***REMOVED***
        console.log(data.text());
        this.data = data.text();
        console.log(this.data);
        this.printData();

      ***REMOVED***);

    ***REMOVED***
    else ***REMOVED***
      this.data = "INVALID"
      console.log(this.data)
    ***REMOVED***
  ***REMOVED***

  printData(): void ***REMOVED***
    console.log(this.data)
  ***REMOVED***

  resetData(): void ***REMOVED***
    if (this.data == 'INVALID') ***REMOVED***
      return;
    ***REMOVED***
    this.data = null;
  ***REMOVED***

  resetData2(): void ***REMOVED***
    this.data = null;
  ***REMOVED***

  onSelectFlavor(flavor: Flavor): void ***REMOVED***
    this.selectedFlavor = flavor;
  ***REMOVED***

  onSelectImage(image: Image): void ***REMOVED***
    this.selectedImage = image
  ***REMOVED***

  checkMetadataKeys(key: string): boolean ***REMOVED***
    for (let metadata of this.metadatalist) ***REMOVED***
      if (metadata.key == key) ***REMOVED***
        return false;
      ***REMOVED***
    ***REMOVED***
    return true;
  ***REMOVED***

  getUserinfo() ***REMOVED***
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.memberssmanager.getMemberByUser(res["id"]).toPromise();

      ***REMOVED***).then(memberinfo => ***REMOVED***
      this.userinfo.MemberId = memberinfo.json()["id"];

    ***REMOVED***)
    this.authzresolver.getPerunPrincipal().toPromise().then(result => ***REMOVED***
      this.userinfo.ElxirId = result.json()['actor'];
    ***REMOVED***).then(result => ***REMOVED***
      this.getUserPublicKey()
    ***REMOVED***);
  ***REMOVED***


  addMetadataItem(key: string, value: string): void ***REMOVED***
    if (key && value && this.checkMetadataKeys(key)) ***REMOVED***
      this.metadatalist.push(new Metadata(key, value));
    ***REMOVED***

  ***REMOVED***

  deleteMetadataItem(metadata: Metadata): void ***REMOVED***
    this.metadatalist.splice(this.metadatalist.indexOf(metadata), 1);
  ***REMOVED***

  ngOnInit(): void ***REMOVED***

    this.userinfo = new Userinfo();
    this.getUserinfo();
    this.getClientData()


  ***REMOVED***
***REMOVED***
