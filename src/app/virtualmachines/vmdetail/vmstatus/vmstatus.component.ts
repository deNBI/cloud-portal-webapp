import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {VirtualMachineStates} from '../../virtualmachinemodels/virtualmachinestates';
import {VirtualMachine} from '../../virtualmachinemodels/virtualmachine';

/**
 * Vmstatus component.
 */
@Component({
             selector: 'app-vmstatus',
             templateUrl: './vmstatus.component.html',
             styleUrls: ['./vmstatus.component.scss']
           })
export class VmstatusComponent {
  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  @Input() vm: VirtualMachine;
  @Input() with_text: boolean = false;

  constructor() {
  }

}
