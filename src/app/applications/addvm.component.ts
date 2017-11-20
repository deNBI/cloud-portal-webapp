import {Component, OnInit, TemplateRef} from '@angular/core';
import {Image} from "../virtualmachinemodels/image";
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {Flavor} from '../virtualmachinemodels/flavor';
import { ImageService } from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {ImageDetailComponent} from "./imagedetail.component";
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {Metadata} from '../virtualmachinemodels/metadata';
import {VirtualmachineService} from "../api-connector/virtualmachine.service";

@Component({
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers:[ImageService,FlavorService,VirtualmachineService]
})
export class VirtualMachineComponent implements OnInit{

  constructor (private imageService:ImageService,private  flavorService:FlavorService,private virtualmachineservice:VirtualmachineService){}
  data:string;
  informationButton:string = "Show Information";
  images:Image[];
  metadatalist:Metadata []=[];
  flavors:Flavor[];
  selectedImage:Image;
  selectedFlavor:Flavor;


  getImages():void{
  this.imageService.getImages().subscribe(images => this.images = images);
  }
 getFlavors():void{
  this.flavorService.getFlavors().subscribe(flavors => this.flavors = flavors);

  }

  toggleInformationButton():void{
    if (this.informationButton == "Show Information"){
      this.informationButton = "Hide Information";
    }else{
      this.informationButton = "Show Information";
    }

  }

  startVM(flavor :string,image :string,key:string ,servername:string ):void {
    if (image  && key && flavor && servername) {

        this.virtualmachineservice.startVM(flavor, image, key, servername).subscribe(data => {
          console.log(data.text());
          this.data = data.text();
          console.log(this.data);
          this.printData();

        });
    }
    else{
      this.data="INVALID"
      console.log(this.data)
    }
  }
  printData():void {console.log(this.data)}
  resetData():void{if(this.data=='INVALID' ) {return; }this.data=null;}
   resetData2():void{this.data=null;}
  onSelectFlavor(flavor: Flavor): void {
  this.selectedFlavor = flavor;
}
 onSelectImage(image: Image): void {
  this.selectedImage = image
}
checkMetadataKeys(key:string):boolean{
for(let metadata of this.metadatalist){
  if(metadata.key == key){return false;}
}
return true;
}

addMetadataItem(key:string,value:string):void {
if (key  && value && this.checkMetadataKeys(key) ){this.metadatalist.push(new Metadata(key,value));}

}

deleteMetadataItem(metadata:Metadata):void{
this.metadatalist.splice(this.metadatalist.indexOf(metadata),1);
}
  ngOnInit(): void {
  this.getImages();
  this.getFlavors();


}
}
