import {Component, OnInit, TemplateRef} from '@angular/core';
import 'rxjs/Rx'
import {Volume} from "./virtualmachinemodels/volume";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";


@Component({

    selector: 'volume-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [VirtualmachineService]
})

export class VolumeOverviewComponent implements OnInit {
    volumes: Volume[];
    project_vms: VirtualMachine[];
    selected_vm: VirtualMachine;
    collapse_status: { [id: string]: string } = {};
    isLoaded=false;
    selected_volume: Volume;
    delete_status = 0; // 0 = Waiting ,1 = Succes , 2 = Error ,3 = Detaching Volume , 4 = Succesfully detached Volume, 5 = Attaching  ,6 :Attahing Succesfull ,

    request_status: number; // 0=Delete ,1 =Detach


    constructor(private vmService: VirtualmachineService) {

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

    deleteVolume(volume_id: string, instance_id?: string) {
        this.delete_status = 0;


        if (instance_id) {
            this.delete_status = 3;
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.delete_status = 0;
                }

                this.vmService.deleteVolume(volume_id).subscribe(result => {
                    result = result.json()
                    if (result['Deleted'] && result['Deleted'] === true) {
                        this.delete_status = 1;
                    }
                    else {
                        this.delete_status = 2;
                    }
                    this.getVolumes();
                })
            })

        }
        else {
            this.vmService.deleteVolume(volume_id).subscribe(result => {
                result = result.json();
                if (result['Deleted'] && result['Deleted'] === true) {
                    this.delete_status = 1;
                }
                else {
                    this.delete_status = 2;
                }
                this.getVolumes();

            })
        }
    }

    attachVolume(volume_id: string, instance_id: string) {
        this.delete_status = 5;

        this.vmService.attachVolumetoServer(volume_id, instance_id).subscribe(result => {

            result = result.json();
            if (result['Attached'] && result['Attached'] === true) {
                this.delete_status = 6;
            }
            else {
                this.delete_status = 2;
            }
            this.getVolumes();
        })
    }

    getActiveVmsByProject(groupid: string) {
        this.vmService.getActiveVmsByProject(groupid).subscribe(result => {


            this.project_vms = result;
        })
    }

    detachVolume(volume_id: string, instance_id: string) {
        this.delete_status = 3;
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
            result = result.json();
            if (result['Deleted'] && result['Deleted'] === true) {
                this.delete_status = 4;
            }
            else {
                this.delete_status = 2;
            }
            this.getVolumes();
        })
    }


    ngOnInit(): void {
        this.getVolumes()
        // this.vmService.attachVolumetoServer('ae05210e-7a40-451a-8ed2-98c868c2ef8b','5302d0df-7409-45c9-8c84-33d087f067a8').subscribe()
        // this.vmService.deleteVolume('ae05210e-7a40-451a-8ed2-98c868c2ef8b').subscribe()

    }

}
