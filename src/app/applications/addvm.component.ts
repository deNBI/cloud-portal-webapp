import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from "../virtualmachinemodels/image";
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED*** ImageService ***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***Metadata***REMOVED*** from '../virtualmachinemodels/metadata';

@Component(***REMOVED***
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers:[ImageService,FlavorService]
***REMOVED***)
export class VirtualMachineComponent implements OnInit***REMOVED***

  constructor (private imageService:ImageService,private  flavorService:FlavorService)***REMOVED******REMOVED***
  images:Image[];
  metadatalist:Metadata []=[]
  flavors:Flavor[];
  selectedImage:Image;
  selectedFlavor:Flavor;

  getImages():void***REMOVED***
  this.imageService.getImages().then(images => this.images = images);
  ***REMOVED***
 getFlavors():void***REMOVED***
  this.flavorService.getFlavors().then(flavors => this.flavors = flavors);
  ***REMOVED***

  onSelectFlavor(flavor: Flavor): void ***REMOVED***
  this.selectedFlavor = flavor;
***REMOVED***
 onSelectImage(image: Image): void ***REMOVED***
  this.selectedImage = image;
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
