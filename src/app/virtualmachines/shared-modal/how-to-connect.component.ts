import {Component, Input} from '@angular/core';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';

@Component({
  selector: 'app-how-to-connect',
  templateUrl: 'how-to-connect.component.html'
           })
export class HowToConnectComponent {

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;

  @Input()
  selectedVm: VirtualMachine;
}
