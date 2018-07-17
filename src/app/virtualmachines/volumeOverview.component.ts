import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {ClientService} from "../api-connector/vmClients.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {Volume} from "./virtualmachinemodels/volume";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";


@Component({
    selector: 'client-overview',
    templateUrl: 'volumeOverview.component.html',
    providers: [VirtualmachineService]
})

export class VolumeOverviewComponent implements OnInit {
    volumes: Volume[];
    collapse_status: { [id: string]: string } = {};


    constructor(private vmService: VirtualmachineService) {

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
            this.volumes = result

        })
    }

    deleteVolume(volume_id: string, instance_id?: string) {
        console.log(instance_id)
        if (instance_id) {
            this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
                this.vmService.deleteVolume(volume_id).subscribe(result => {
                    this.getVolumes();
                })
            })

        }
        else {
            this.vmService.deleteVolume(volume_id).subscribe(result => {
                this.getVolumes();

            })
        }
    }

    detachVolume(volume_id: string, instance_id: string) {
        console.log(volume_id);
        console.log(instance_id);
        this.vmService.deleteVolumeAttachment(volume_id, instance_id).subscribe(result => {
            this.getVolumes();
        })
    }


    ngOnInit(): void {
        this.getVolumes()
        // this.vmService.attachVolumetoServer('ae05210e-7a40-451a-8ed2-98c868c2ef8b','5302d0df-7409-45c9-8c84-33d087f067a8').subscribe()
        // this.vmService.deleteVolume('ae05210e-7a40-451a-8ed2-98c868c2ef8b').subscribe()

    }

}
