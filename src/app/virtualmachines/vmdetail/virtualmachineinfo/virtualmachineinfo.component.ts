import {Component, Input, OnInit} from '@angular/core';
import {VirtualMachineStates} from '../../virtualmachinemodels/virtualmachinestates';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';

@Component({
             selector: 'app-virtualmachineinfo',
             templateUrl: './virtualmachineinfo.component.html',
             styleUrls: ['./virtualmachineinfo.component.scss']
           })
export class VirtualmachineinfoComponent {
  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  @Input() vm: VirtualMachine;

  constructor() {
  }

}
