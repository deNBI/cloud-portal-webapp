import {Component, OnInit} from '@angular/core';
import {Image} from "../virtualmachinemodels/image";
import {Flavor} from '../virtualmachinemodels/flavor';
import { ImageService } from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {ImageDetailComponent} from "./imagedetail.component";
import {FormsModule} from '@angular/forms';
import {Metadata} from '../virtualmachinemodels/metadata';

@Component({
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers:[ImageService,FlavorService]
})
export class VirtualMachineComponent implements OnInit{

  constructor (private imageService:ImageService,private  flavorService:FlavorService){}
  images:Image[];
  metadatalist:Metadata []=[]
  flavors:Flavor[];
  selectedImage:Image;
  selectedFlavor:Flavor;

  getImages():void{
  this.imageService.getImages().then(images => this.images = images);
  }
 getFlavors():void{
  this.flavorService.getFlavors().then(flavors => this.flavors = flavors);
  }

  onSelectFlavor(flavor: Flavor): void {
  this.selectedFlavor = flavor;
}
 onSelectImage(image: Image): void {
  this.selectedImage = image;
}

addMetadataItem(key:string,value:string):void {
if (key  && value ){this.metadatalist.push(new Metadata(key,value));}

}
deleteMetadataItem(metadata:Metadata):void{
this.metadatalist.splice(this.metadatalist.indexOf(metadata,1));
}
  ngOnInit(): void {
  this.getImages();
  this.getFlavors();


}
}
