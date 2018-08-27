import {Component, OnInit, TemplateRef} from '@angular/core';
import {Volume} from "./virtualmachinemodels/volume";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {GroupService} from "../api-connector/group.service";


@Component({

    selector: 'volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [GroupService, VirtualmachineService]
})

export class VolumeOverviewComponent implements OnInit {
    volumes: Volume[];
    project_vms: VirtualMachine[];
    selected_vm: VirtualMachine;
    collapse_status: { [id: string]: string } = {};
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


    constructor(private groupService: GroupService, private vmService: VirtualmachineService) {

    }

    setRequestStatus(status: number) {
        this.request_status = status;
    }

    setSelectedVolume(volume: Volume) {
        this.selected_volume = volume;
    }

    public getCollapseStatus(id: string) {
        if (id in this.collapse_status) {
            this.switchCollapseStatus(id);
        } else {
            this.collapse_status[id] = 'open';
        }
    }

    public switchCollapseStatus(id: string) {
        this.collapse_status[id] == '' ? this.collapse_status[id] = 'open' : this.collapse_status[id] = '';
    }


    getVolumes() {
        this.vmService.getVolumesByUser().subscribe(result => {
            this.volumes = result;
            this.isLoaded=true;

        })
    }

    getSelectedProjectDiskspace(): void {
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {


                this.selectedProjectDiskspaceMax = result['Diskspace'];

            }
            else if (result['Diskspace'] === null || result['Diskspace'] === 0) {
                this.selectedProjectDiskspaceMax = 0;
            }

        })
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            }
            else if (result['Diskspace'] == 0 || result['Diskspace'] == null) {
                this.selectedProjectDiskspaceUsed = 0;
            }


        })

    }

    getSelectedProjectVolumes(): void {
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => {
            if (result['VolumeCounter']) {
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            }
            else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) {
                this.selectedProjectVolumesMax = 0;
            }
        })
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => {
            console.log(result)
            if (result['UsedVolumes']) {
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
                console.log(this.selectedProjectVolumesUsed)
            }
            else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) {

                this.selectedProjectVolumesUsed = 0;
            }

        })
    }

    deleteVolume(volume_id: string, instance_id?: string) {
        this.volume_status = 0;


        if (instance_id) {
            this.volume_status = 3;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.volume_status = 0;
                }

                this.vmService.deleteVolume(volume_id).subscribe(result => {
                    if (result['Deleted'] && result['Deleted'] === true) {
                        this.volume_status = 1;
                    }
                    else {
                        this.volume_status = 2;
                    }
                    this.getVolumes();
                })
            })

        }
        else {
            this.vmService.deleteVolume(volume_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.volume_status = 1;
                }
                else {
                    this.volume_status = 2;
                }
                this.getVolumes();

            })
        }
    }

    attachVolume(volume_id: string, instance_id: string) {
        this.volume_status = 5;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

            if (result['Attached'] && result['Attached'] === true) {
                this.volume_status = 6;
            }
            else {
                this.volume_status = 2;
            }
            this.getVolumes();
        })
    }

    createVolume(volume_name: string, diskspace: number, instance_id: string) {
        this.volume_status = 0
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                this.volume_status = 7;
            }
            else {
                this.volume_status = 2;
            }
            this.getVolumes();

        })
    }

    createAndAttachvolume(volume_name: string, diskspace: number, instance_id: string) {
        this.volume_status = 7;
        this.vmService.createVolume(volume_name, diskspace.toString(), instance_id).subscribe(result => {
            if (result['Created']) {
                let volume_id = result['Created']
                this.volume_status = 5;

                this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

                    if (result['Attached'] && result['Attached'] === true) {
                        this.volume_status = 8;
                    }
                    else {
                        this.volume_status = 2;
                    }
                    this.getVolumes();
                })
            }
            else {
                this.volume_status = 2;
            }
            this.getVolumes();

        })

    }


    getActiveVmsByProject(groupid: number) {
        this.vmService.getActiveVmsByProject(groupid.toString()).subscribe(result => {


            this.project_vms = result;
        })
    }

    detachVolume(volume_id: string, instance_id: string) {
        this.volume_status = 3;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
            if (result['Deleted'] && result['Deleted'] === true) {
                this.volume_status = 4;
            }
            else {
                this.volume_status = 2;
            }
            this.getVolumes();
        })
    }

    getUserApprovedProjects() {
        this.groupService.getMemberGroupsStatus().toPromise().then(membergroups => {
            for (let project of membergroups) {
                this.projects.push(project);

            }
        });
    }


    ngOnInit(): void {
        this.getVolumes()
        this.getUserApprovedProjects();

        // this.vmService.attachVolumetoServer('ae05210e-7a40-451a-8ed2-98c868c2ef8b','5302d0df-7409-45c9-8c84-33d087f067a8').subscribe()
        // this.vmService.deleteVolume('ae05210e-7a40-451a-8ed2-98c868c2ef8b').subscribe()

    }

}
