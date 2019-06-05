import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachinemodels/virtualmachine';

@Component(***REMOVED***
  selector: 'app-how-to-connect',
  templateUrl: 'how-to-connect.component.html'
           ***REMOVED***)
export class HowToConnectComponent ***REMOVED***

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;

  @Input()
  selectedVm: VirtualMachine;
***REMOVED***
