import { Component, Input } from '@angular/core';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';
import { VirtualMachine } from '../../virtualmachinemodels/virtualmachine';
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';

/**
 * Vmstatus component.
 */
@Component({
	selector: 'app-vmstatus',
	templateUrl: './vmstatus.component.html',
	styleUrls: ['./vmstatus.component.scss'],
})
export class VmstatusComponent {
	VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();
  @Input() vm: VirtualMachine;
  @Input() with_text: boolean = false;
  CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
}
