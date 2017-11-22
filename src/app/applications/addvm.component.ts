import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from "../virtualmachinemodels/image";
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED*** ImageService ***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***Metadata***REMOVED*** from '../virtualmachinemodels/metadata';
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";

@Component(***REMOVED***
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers:[ImageService,FlavorService,VirtualmachineService]
***REMOVED***)
export class VirtualMachineComponent implements OnInit***REMOVED***
  data:string;
  informationButton:string = "Show Information";
  images:Image[];
  metadatalist:Metadata []=[];
  flavors:Flavor[];
  selectedImage:Image;
  selectedFlavor:Flavor;

  constructor (private imageService:ImageService,private  flavorService:FlavorService,private virtualmachineservice:VirtualmachineService)***REMOVED******REMOVED***


  getImages():void***REMOVED***
  this.imageService.getImages().subscribe(images => this.images = images);
  ***REMOVED***
 getFlavors():void***REMOVED***
  this.flavorService.getFlavors().subscribe(flavors => this.flavors = flavors);

  ***REMOVED***

  toggleInformationButton():void***REMOVED***
    if (this.informationButton == "Show Information")***REMOVED***
      this.informationButton = "Hide Information";
    ***REMOVED***else***REMOVED***
      this.informationButton = "Show Information";
    ***REMOVED***

  ***REMOVED***

  startVM(flavor :string,image :string,servername:string ):void ***REMOVED***
    if (image  && flavor && servername) ***REMOVED***

        this.virtualmachineservice.startVM(flavor, image, "test", servername).subscribe(data => ***REMOVED***
          console.log(data.text());
          this.data = data.text();
          console.log(this.data);
          this.printData();

        ***REMOVED***);
    ***REMOVED***
    else***REMOVED***
      this.data="INVALID"
      console.log(this.data)
    ***REMOVED***
  ***REMOVED***
  printData():void ***REMOVED***console.log(this.data)***REMOVED***
  resetData():void***REMOVED***if(this.data=='INVALID' ) ***REMOVED***return; ***REMOVED***this.data=null;***REMOVED***
   resetData2():void***REMOVED***this.data=null;***REMOVED***
  onSelectFlavor(flavor: Flavor): void ***REMOVED***
  this.selectedFlavor = flavor;
***REMOVED***
 onSelectImage(image: Image): void ***REMOVED***
  this.selectedImage = image
***REMOVED***
checkMetadataKeys(key:string):boolean***REMOVED***
for(let metadata of this.metadatalist)***REMOVED***
  if(metadata.key == key)***REMOVED***return false;***REMOVED***
***REMOVED***
return true;
***REMOVED***

addMetadataItem(key:string,value:string):void ***REMOVED***
if (key  && value && this.checkMetadataKeys(key) )***REMOVED***this.metadatalist.push(new Metadata(key,value));***REMOVED***

***REMOVED***

deleteMetadataItem(metadata:Metadata):void***REMOVED***
this.metadatalist.splice(this.metadatalist.indexOf(metadata),1);
***REMOVED***
  ngOnInit(): void ***REMOVED***
  this.getImages();
  this.getFlavors();


***REMOVED***
***REMOVED***
