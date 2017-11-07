import { Component,Input,OnInit} from '@angular/core';
import { Flavor} from '../virtualmachinemodels/flavor'

@Component({
  selector: 'flavor-detail',
  templateUrl:'flavordetail.component.html'


})
export class FlavorDetailComponent implements OnInit{
  @Input() flavor: Flavor;


  construcot(){}
  ngOnInit(){}
}
