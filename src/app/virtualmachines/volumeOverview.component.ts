import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import 'rxjs/Rx'
import ***REMOVED***Volume***REMOVED*** from "./virtualmachinemodels/volume";
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***VirtualMachine***REMOVED*** from "./virtualmachinemodels/virtualmachine";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";


@Component(***REMOVED***

    selector: 'volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [GroupService, VirtualmachineService]
***REMOVED***)

export class VolumeOverviewComponent implements OnInit ***REMOVED***
    volumes: Volume[];
    project_vms: VirtualMachine[];
    selected_vm: VirtualMachine;
    collapse_status: ***REMOVED*** [id: string]: string ***REMOVED*** = ***REMOVED******REMOVED***;
    isLoaded=false;
    selected_volume: Volume;
    selectedProjectDiskspaceMax: number;
    selectedProjectDiskspaceUsed: number;
    selectedProjectVolumesMax: number;
    selectedProjectVolumesUsed: number;
    selectedProject: [string, number];
    projects: string[] = new Array();
    diskspace: number = 1;
    volumeName: string = '';

    volume_status = 0; // 0 = Waiting ,1 = Succes , 2 = Error ,3 = Detaching Volume , 4 = Succesfully detached Volume, 5 = Attaching  ,6 :Attahing Succesfull ,7:wait creation 8:succesfully attached and created

    request_status: number; // 0=Delete ,1 =Detach


    constructor(private groupService: GroupService, private vmService: VirtualmachineService) ***REMOVED***

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

    getSelectedProjectDiskspace(): void ***REMOVED***
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***


                this.selectedProjectDiskspaceMax = result['Diskspace'];

            ***REMOVED***
            else if (result['Diskspace'] === null || result['Diskspace'] === 0) ***REMOVED***
                this.selectedProjectDiskspaceMax = 0;
            ***REMOVED***

        ***REMOVED***)
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            ***REMOVED***
            else if (result['Diskspace'] == 0 || result['Diskspace'] == null) ***REMOVED***
                this.selectedProjectDiskspaceUsed = 0;
            ***REMOVED***


        ***REMOVED***)

    ***REMOVED***

    getSelectedProjectVolumes(): void ***REMOVED***
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['VolumeCounter']) ***REMOVED***
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            ***REMOVED***
            else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) ***REMOVED***
                this.selectedProjectVolumesMax = 0;
            ***REMOVED***
        ***REMOVED***)
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            console.log(result)
            if (result['UsedVolumes']) ***REMOVED***
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
                console.log(this.selectedProjectVolumesUsed)
            ***REMOVED***
            else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) ***REMOVED***

                this.selectedProjectVolumesUsed = 0;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    deleteVolume(volume_id: string, instance_id?: string) ***REMOVED***
        this.volume_status = 0;


        if (instance_id) ***REMOVED***
            this.volume_status = 3;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => ***REMOVED***
                if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                    this.volume_status = 0;
                ***REMOVED***

                this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                    result = result.json()
                    if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                        this.volume_status = 1;
                    ***REMOVED***
                    else ***REMOVED***
                        this.volume_status = 2;
                    ***REMOVED***
                    this.getVolumes();
                ***REMOVED***)
            ***REMOVED***)

        ***REMOVED***
        else ***REMOVED***
            this.vmService.deleteVolume(volume_id).subscribe(result => ***REMOVED***
                result = result.json();
                if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                    this.volume_status = 1;
                ***REMOVED***
                else ***REMOVED***
                    this.volume_status = 2;
                ***REMOVED***
                this.getVolumes();

            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***

    attachVolume(volume_id: string, instance_id: string) ***REMOVED***
        this.volume_status = 5;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => ***REMOVED***

            result = result.json();
            if (result['Attached'] && result['Attached'] === true) ***REMOVED***
                this.volume_status = 6;
            ***REMOVED***
            else ***REMOVED***
                this.volume_status = 2;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***

    createVolume(volume_name: string, diskspace: number, instance_id: string) ***REMOVED***
        this.volume_status = 0
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => ***REMOVED***
            result = result.json();
            if (result['Created']) ***REMOVED***
                this.volume_status = 7;
            ***REMOVED***
            else ***REMOVED***
                this.volume_status = 2;
            ***REMOVED***
            this.getVolumes();

        ***REMOVED***)
    ***REMOVED***

    createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string) ***REMOVED***
        this.volume_status = 7;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => ***REMOVED***
            result = result.json();
            if (result['Created']) ***REMOVED***
                let volume_id = result['Created']
                this.volume_status = 5;

                this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => ***REMOVED***

                    result = result.json();
                    if (result['Attached'] && result['Attached'] === true) ***REMOVED***
                        this.volume_status = 8;
                    ***REMOVED***
                    else ***REMOVED***
                        this.volume_status = 2;
                    ***REMOVED***
                    this.getVolumes();
                ***REMOVED***)
            ***REMOVED***
            else ***REMOVED***
                this.volume_status = 2;
            ***REMOVED***
            this.getVolumes();

        ***REMOVED***)

    ***REMOVED***


    getActiveVmsByProject(groupid: number) ***REMOVED***
        this.vmService.getActiveVmsByProject(groupid.toString()).subscribe(result => ***REMOVED***


            this.project_vms = result;
        ***REMOVED***)
    ***REMOVED***

    detachVolume(volume_id: string, instance_id: string) ***REMOVED***
        this.volume_status = 3;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => ***REMOVED***
            result = result.json();
            if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                this.volume_status = 4;
            ***REMOVED***
            else ***REMOVED***
                this.volume_status = 2;
            ***REMOVED***
            this.getVolumes();
        ***REMOVED***)
    ***REMOVED***

    getUserApprovedProjects() ***REMOVED***
        this.groupService.getMemberGroupsStatus().toPromise().then(membergroups => ***REMOVED***
            for (let project of membergroups.json()) ***REMOVED***
                this.projects.push(project);

            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.getVolumes()
        this.getUserApprovedProjects();

        // this.vmService.attachVolumetoServer('ae05210e-7a40-451a-8ed2-98c868c2ef8b','5302d0df-7409-45c9-8c84-33d087f067a8').subscribe()
        // this.vmService.deleteVolume('ae05210e-7a40-451a-8ed2-98c868c2ef8b').subscribe()

    ***REMOVED***

***REMOVED***
