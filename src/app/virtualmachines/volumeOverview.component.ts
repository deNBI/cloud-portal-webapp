import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import 'rxjs/Rx'
import ***REMOVED***Volume***REMOVED*** from "./virtualmachinemodels/volume";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "./virtualmachinemodels/virtualmachine";


@Component(***REMOVED***

    selector: 'volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [VirtualmachineService]
***REMOVED***)

export class VolumeOverviewComponent implements OnInit ***REMOVED***
    volumes: Volume[];
    project_vms: VirtualMachine[];
    selected_vm: VirtualMachine;
    collapse_status: ***REMOVED*** [id: string]: string ***REMOVED*** = ***REMOVED******REMOVED***;
    isLoaded=false;
    selected_volume: Volume;
    delete_status = 0; // 0 = Waiting ,1 = Succes , 2 = Error ,3 = Detaching Volume , 4 = Succesfully detached Volume, 5 = Attaching  ,6 :Attahing Succesfull ,

    request_status: number; // 0=Delete ,1 =Detach


    constructor(private vmService: VirtualmachineService) ***REMOVED***

    ***REMOVED***

    setRequestStatus(status: number) ***REMOVED***
        this.request_status = status;
    ***REMOVED***

    setSelectedVolume(volume: Volume) ***REMOVED***
        this.selected_volume = volume;
    ***REMOVED***

    public getCollapseStatus(id: string) ***REMOVED***
        if (id in this.collapse_status) ***REMOVED***
            this.switchCollapseStatus(id);
        ***REMOVED*** else ***REMOVED***
            this.collapse_status[id] = 'open';
        ***REMOVED***
    ***REMOVED***

    public switchCollapseStatus(id: string) ***REMOVED***
        this.collapse_status[id] == '' ? this.collapse_status[id] = 'open' : this.collapse_status[id] = '';
    ***REMOVED***


    getVolumes() ***REMOVED***
        this.vmService.getVolumesByUser().subscribe(result => ***REMOVED***
            this.volumes = result;
            this.isLoaded=true;

        ***REMOVED***)
    ***REMOVED***

    deleteVolume(volume_id: string, instance_id?: string) ***REMOVED***
        this.delete_status = 0;


        if (instance_id) ***REMOVED***
            this.delete_status = 3;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => ***REMOVED***
                if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                    this.delete_status = 0;
                ***REMOVED***

                this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                    result = result.json()
                    if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                        this.delete_status = 1;
                    ***REMOVED***
                    else ***REMOVED***
                        this.delete_status = 2;
                    ***REMOVED***
                    this.getVolumes();
                ***REMOVED***)
            ***REMOVED***)

        ***REMOVED***
        else ***REMOVED***
            this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                result = result.json();
                if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                    this.delete_status = 1;
                ***REMOVED***
                else ***REMOVED***
                    this.delete_status = 2;
                ***REMOVED***
                this.getVolumes();

            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***

    attachVolume(volume_id: string, instance_id: string) ***REMOVED***
        this.delete_status = 5;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => ***REMOVED***

            result = result.json();
            if (result['Attached'] && result['Attached'] === true) ***REMOVED***
                this.delete_status = 6;
            ***REMOVED***
            else ***REMOVED***
                this.delete_status = 2;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***

    getActiveVmsByProject(groupid: string) ***REMOVED***
        this.vmService.getActiveVmsByProject(groupid).subscribe(result => ***REMOVED***


            this.project_vms = result;
        ***REMOVED***)
    ***REMOVED***

    detachVolume(volume_id: string, instance_id: string) ***REMOVED***
        this.delete_status = 3;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => ***REMOVED***
            result = result.json();
            if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                this.delete_status = 4;
            ***REMOVED***
            else ***REMOVED***
                this.delete_status = 2;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.getVolumes()
        // this.vmService.attachVolumetoServer('ae05210e-7a40-451a-8ed2-98c868c2ef8b','5302d0df-7409-45c9-8c84-33d087f067a8').subscribe()
        // this.vmService.deleteVolume('ae05210e-7a40-451a-8ed2-98c868c2ef8b').subscribe()

    ***REMOVED***

***REMOVED***
