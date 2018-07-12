import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'
import ***REMOVED***Vmclient***REMOVED*** from "./virtualmachinemodels/vmclient";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***Volume***REMOVED*** from "./virtualmachinemodels/volume";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";


@Component(***REMOVED***
  selector: 'client-overview',
  templateUrl: 'volumeOverview.component.html',
  providers: [VirtualmachineService]
***REMOVED***)

export class VolumeOverviewComponent implements OnInit ***REMOVED***
  volumes: Volume[];


  constructor(private vmService:VirtualmachineService) ***REMOVED***

  ***REMOVED***

  getVolumes()***REMOVED***
      this.vmService.getVolumesByUser().subscribe(result =>***REMOVED***
          this.volumes=result
      ***REMOVED***)
  ***REMOVED***


  ngOnInit(): void ***REMOVED***
    this.getVolumes()

  ***REMOVED***

***REMOVED***
