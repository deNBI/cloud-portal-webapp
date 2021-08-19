import { Component, Input } from '@angular/core';
import { Clusterinfo } from '../clusterinfo';
import { VirtualMachineStates } from '../../virtualmachinemodels/virtualmachinestates';

/**
 * Clusterstatus component.
 */
@Component({
	selector: 'app-clusterstatus',
	templateUrl: './clusterstatus.component.html',
})
export class ClusterstatusComponent {
  @Input() cluster: Clusterinfo;
  VirtualMachineStates: VirtualMachineStates = new VirtualMachineStates();

}
