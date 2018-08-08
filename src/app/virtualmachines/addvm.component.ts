import {
    Component, OnInit, TemplateRef, ViewChild,
    AfterViewInit,
    ElementRef
} from '@angular/core';
import {Image} from "./virtualmachinemodels/image";
import {ModalDirective} from "ngx-bootstrap";
import {Flavor} from './virtualmachinemodels/flavor';
import {ImageService} from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {ImageDetailComponent} from "./imagedetail.component";
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'
import {forkJoin} from 'rxjs';

import {Metadata} from './virtualmachinemodels/metadata';
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {ApplicationsService} from '../api-connector/applications.service'
import {Userinfo} from "../userinfo/userinfo.model";
import {ApiSettings} from "../api-connector/api-settings.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";

import {ClientService} from "../api-connector/vmClients.service";
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {Application} from "../applications/application.model";
import {keyService} from "../api-connector/key.service";
import {Project} from "../projectmanagement/project.model";
import {GroupService} from "../api-connector/group.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'new-vm',
    templateUrl: 'addvm.component.html',
    providers: [GroupService, ImageService, keyService, FlavorService, VirtualmachineService, ApplicationsService, Application, PerunSettings, ApiSettings, keyService, ClientService]
})
export class VirtualMachineComponent implements OnInit {


    data: string = "";


    informationButton: string = "Show Details";
    informationButton2: string = "Show Details";
    images: Image[];
    metadatalist: Metadata [] = [];
    flavors: Flavor[];
    selectedImage: Image;
    selectedFlavor: Flavor;
    userinfo: Userinfo;
    vmclient: Vmclient;
    selectedProjectDiskspaceMax: number;
    selectedProjectDiskspaceUsed: number;
    selectedProjectVolumesMax: number;
    selectedProjectVolumesUsed: number;
    selectedProjectVmsMax: number;
    selectedProjectVmsUsed: number;
    selectedProject: [string, number];
    client_avaiable: boolean;
    validPublickey: boolean;

    volumeName: string = '';

    optional_params = false;
    diskspace: number = 0;
    isLoaded = false;

    projects: string[] = new Array();
    FREEMIUM_ID = environment.freemium_project_id;
    private checkStatusTimeout: number = 5000;


    constructor(private groupService: GroupService, private imageService: ImageService, private applicataionsservice: ApplicationsService, private  flavorService: FlavorService, private virtualmachineservice: VirtualmachineService, private  keyService: keyService, private clientservice: ClientService) {
    }


    getImages(): void {

        this.imageService.getImages().subscribe(images => this.images = images);
    }

    getFlavors(): void {
        this.flavorService.getFlavors().subscribe(flavors => this.flavors = flavors);

    }


    getClientData() {
        this.clientservice.getClientsChecked().subscribe(response => {
            this.getRRFirstClient();


        })
    }

    getRRFirstClient(): void {
        this.clientservice.isClientAvaiable().subscribe(client => {
                if (client.toString() === "true") {

                    this.client_avaiable = true;
                    this.getImages();
                    this.getFlavors();
                }
                else {
                    this.client_avaiable = false;
                }


            }
        )
        ;
    }

    validatePublicKey() {

        if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)) {
            this.validPublickey = true;
        }
        else {

            this.validPublickey = false;
        }


    }

    getUserPublicKey() {
        this.keyService.getKey().subscribe(result => {
            console.log(result['public_key']);
            this.userinfo.PublicKey = result['public_key'];
        })
    }

    toggleInformationButton(): void {
        if (this.informationButton == "Show Details") {
            this.informationButton = "Hide Details";
        } else {
            this.informationButton = "Show Details";
        }

    }

    toggleInformationButton2(): void {
        if (this.informationButton2 == "Show Details") {
            this.informationButton2 = "Hide Details";
        } else {
            this.informationButton2 = "Show Details";
        }

    }

    check_status_loop(id: string) {

        setTimeout(() => {
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => {
                res = res;
                if (res['Started'] || res['Error']) {
                    this.data = res
                    this.getSelectedProjectDiskspace();
                    this.getSelectedProjectVms();
                    this.getSelectedProjectVolumes();


                }
                else {
                    this.check_status_loop(id)
                }

            })
        }, this.checkStatusTimeout);
    }

    startVM(flavor: string, image: string, servername: string, project: string, projectid: string): void {
        if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) {


            this.virtualmachineservice.startVM(flavor, image, servername, project, projectid, this.volumeName, this.diskspace.toString()).subscribe(data => {


                if (data['Created']) {
                    this.check_status_loop(data['Created']);
                }
                else {
                    this.data = data
                }


            });

        }
        else {
            this.data = "INVALID"

        }
    }


    resetData(): void {
        if (this.data == 'INVALID') {
            return;
        }
        this.data = '';
    }

    resetData2(): void {
        this.data = '';
    }

    onSelectFlavor(flavor: Flavor): void {
        this.selectedFlavor = flavor;
    }

    onSelectImage(image: Image): void {
        this.selectedImage = image
    }

    checkMetadataKeys(key: string): boolean {
        for (let metadata of this.metadatalist) {
            if (metadata.key == key) {
                return false;
            }
        }
        return true;
    }


    addMetadataItem(key: string, value: string): void {
        if (key && value && this.checkMetadataKeys(key)) {
            this.metadatalist.push(new Metadata(key, value));
        }

    }

    deleteMetadataItem(metadata: Metadata): void {
        this.metadatalist.splice(this.metadatalist.indexOf(metadata), 1);
    }

    getUserApprovedProjects() {
        this.groupService.getMemberGroupsStatus().toPromise().then(membergroups => {
            for (let project of membergroups) {
                this.projects.push(project);

            }
        });
    }

    initializeData() {
        forkJoin(this.imageService.getImages(), this.flavorService.getFlavors(), this.groupService.getMemberGroupsStatus(), this.keyService.getKey()).subscribe(result => {
            this.images = result[0];
            this.flavors = result[1];
            this.userinfo.PublicKey = result[3]['public_key'];
            this.validatePublicKey();
            let membergroups = result[2];
            for (let project of membergroups) {
                this.projects.push(project);

            }
            this.isLoaded = true;
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
            if (result['UsedVolumes']) {
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            }
            else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) {

                this.selectedProjectVolumesUsed = 0;
            }

        })
    }


    getSelectedProjectVms(): void {
        this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()).subscribe(result => {
            if (result['NumberVms']) {


                this.selectedProjectVmsMax = result['NumberVms'];

            }
            else if (result['NumberVms'] === null || result['NumberVms'] === 0) {
                this.selectedProjectVmsMax = 0;
            }

        })
        this.groupService.getGroupUsedVms(this.selectedProject[1].toString()).subscribe(result => {
            if (result['NumberVms']) {

                this.selectedProjectVmsUsed = result['NumberVms'];
            }
            else if (result['NumberVms'] == 0 || result['NumberVms'] == null) {
                this.selectedProjectVmsUsed = 0;
            }


        })

    }

    ngOnInit(): void {

        this.userinfo = new Userinfo();
        this.getClientData();
        this.initializeData();


    }
}
