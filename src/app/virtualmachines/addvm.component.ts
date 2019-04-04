import {Component, OnInit} from '@angular/core';
import {Image} from './virtualmachinemodels/image';
import {Flavor} from './virtualmachinemodels/flavor';
import {ImageService} from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {forkJoin} from 'rxjs';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {ApplicationsService} from '../api-connector/applications.service'
import {Userinfo} from '../userinfo/userinfo.model';
import {ApiSettings} from '../api-connector/api-settings.service';
import {ClientService} from "../api-connector/client.service";
import {Application} from '../applications/application.model';
import {KeyService} from '../api-connector/key.service';
import {GroupService} from '../api-connector/group.service';
import {environment} from '../../environments/environment';
import {Client} from "./clients/client.model";

/**
 * Start virtualmachine component.
 */
@Component({
    selector: 'app-new-vm',
    templateUrl: 'addvm.component.html',
    providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService, ApplicationsService,
        Application, ApiSettings, KeyService, ClientService]
})
export class VirtualMachineComponent implements OnInit {

    data: string = '';
    creating_vm_status: string = 'Creating..';
    creating_vm_prograss_bar: string = 'progress-bar-animated';
    checking_vm_status: string = '';
    checking_vm_status_width: number = 0;
    checking_vm_status_progress_bar: string = 'progress-bar-animated';
    checking_vm_ssh_port: string = '';
    checking_vm_ssh_port_width: number = 0;

    informationButton: string = 'Show Details';
    informationButton2: string = 'Show Details';
    client_checked: boolean = false;

    /**
     * All image of a project.
     */
    images: Image[];

    /**
     * All flavors of a project.
     */
    flavors: Flavor[];

    /**
     * Selected Image.
     */
    selectedImage: Image;

    /**
     * Selected Flavor.
     */
    selectedFlavor: Flavor;

    /**
     * Userinfo from the user.
     */
    userinfo: Userinfo;

    /**
     * Selected Project vms client.
     */
    selectedProjectClient: Client;

    /**
     * Selected Project diskspace max.
     */
    selectedProjectDiskspaceMax: number;

    /**
     * Selected Project diskspace used.
     */
    selectedProjectDiskspaceUsed: number;

    /**
     * Selected Project volumes max.
     */
    selectedProjectVolumesMax: number;

    /**
     * Selected Project volumes used.
     */
    selectedProjectVolumesUsed: number;

    /**
     * Selected Project vms max.
     */
    selectedProjectVmsMax: number;

    /**
     * Selected Project vms used.
     */
    selectedProjectVmsUsed: number;

    /**
     * The selected project ['name',id].
     */
    selectedProject: [string, number];

    /**
     * If the client for a project is viable.
     */
    client_avaiable: boolean = false;

    /**
     * If the public key is valid.
     */
    validPublickey: boolean;

    /**
     * Default volume name.
     * @type {string}
     */
    volumeName: string = '';

    /**
     * If optional params are shown.
     * @type {boolean}
     */
    optional_params: boolean = false;

    /**
     * Default diskspace.
     * @type {number}
     */
    diskspace: number = 0;

    /**
     * If the data for the site is initialized.
     * @type {boolean}
     */
    isLoaded: boolean = false;

    /**
     * All projects of the user.
     * @type {any[]}
     */
    projects: string[] = new Array();

    /**
     * Id of the freemium project.
     * @type {number}
     */
    FREEMIUM_ID: number = environment.freemium_project_id;

    /**
     * Time for the check status loop.
     * @type {number}
     */
    private checkStatusTimeout: number = 5000;

    constructor(private groupService: GroupService, private imageService: ImageService,
                private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
                private keyservice: KeyService) {
    }

    /**
     * Get images for the project.
     * @param {number} project_id
     */
    getImages(project_id: number): void {

        this.imageService.getImages(project_id).subscribe(images => this.images = images);
    }

    /**
     * Get flavors for the project.
     * @param {number} project_id
     */
    getFlavors(project_id: number): void {
        this.flavorService.getFlavors(project_id).subscribe(flavors => this.flavors = flavors);

    }

    /**
     * Validate the public key of the user.
     */
    validatePublicKey(): boolean {

        return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)

    }

    /**
     * Get the public key of the user.
     */
    getUserPublicKey(): void {
        this.keyservice.getKey().subscribe(result => {
            this.userinfo.PublicKey = result['public_key'];
        })
    }

    /**
     * Toggle information button 1.
     */
    toggleInformationButton(): void {
        if (this.informationButton === 'Show Details') {
            this.informationButton = 'Hide Details';
        } else {
            this.informationButton = 'Show Details';
        }

    }

    /**
     * Toggle information button 2.
     */
    toggleInformationButton2(): void {
        if (this.informationButton2 === 'Show Details') {
            this.informationButton2 = 'Hide Details';
        } else {
            this.informationButton2 = 'Show Details';
        }

    }

    /**
     * Reset the progress bar.
     */
    resetProgressBar(): void {
        this.creating_vm_status = 'Creating..';
        this.creating_vm_prograss_bar = 'progress-bar-animated';
        this.checking_vm_status = '';
        this.checking_vm_status_width = 0;
        this.checking_vm_status_progress_bar = 'progress-bar-animated';
        this.checking_vm_ssh_port = '';
        this.checking_vm_ssh_port_width = 0;
    }

    /**
     * Check the status of the started vm in a loop.
     * @param {string} id
     */
    check_status_loop(id: string): void {

        setTimeout(
            () => {
                this.virtualmachineservice.checkVmStatus(id).subscribe(res => {
                    if (res['Started'] || res['Error']) {
                        this.resetProgressBar();
                        this.data = res;
                        this.getSelectedProjectDiskspace();
                        this.getSelectedProjectVms();
                        this.getSelectedProjectVolumes();

                    } else {
                        if (res['Waiting'] === 'PORT_CLOSED') {
                            this.checking_vm_status = 'Active';
                            this.checking_vm_status_progress_bar = '';
                            this.creating_vm_prograss_bar = '';
                            this.checking_vm_ssh_port = 'Checking port..';
                            this.checking_vm_ssh_port_width = 34;

                        }
                        this.check_status_loop(id)
                    }

                })
            },
            this.checkStatusTimeout);
    }

    /**
     * Start a virtual machine with specific params.
     * @param {string} flavor
     * @param {string} image
     * @param {string} servername
     * @param {string} project
     * @param {string} projectid
     */
    startVM(flavor: string, image: string, servername: string, project: string, projectid: string): void {
        if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) {
            const re: RegExp = /\+/gi;

            const flavor_fixed: string = flavor.replace(re, '%2B');

            this.virtualmachineservice.startVM(
                flavor_fixed, image, servername, project, projectid,
                this.volumeName, this.diskspace.toString()).subscribe(data => {

                if (data['Created']) {
                    this.creating_vm_status = 'Created';
                    this.creating_vm_prograss_bar = '';
                    this.checking_vm_status = 'Checking status..';
                    this.checking_vm_status_progress_bar = 'progress-bar-animated';
                    this.checking_vm_status_width = 33;

                    this.check_status_loop(data['Created']);
                } else {
                    this.creating_vm_status = 'Creating';

                    this.data = data
                }

            });

        } else {
            this.creating_vm_status = 'Creating';

            this.data = 'INVALID'

        }
    }

    /**
     * Get the client from the selected project.
     * If connected geht vm,volumes etc.
     * @param {number} groupid
     */
    getSelectedProjectClient(groupid: number): void {
        this.client_checked = false;
        this.groupService.getClient(this.selectedProject[1].toString()).subscribe(res => {
            this.selectedProjectClient = res;
            if (res['status'] === 'Connected') {
                this.client_avaiable = true;

                this.getSelectedProjectDiskspace();
                this.getSelectedProjectVms();
                this.getSelectedProjectVolumes();
                this.getImages(this.selectedProject[1]);
                this.getFlavors(this.selectedProject[1]);
                this.client_checked = true;
            } else {
                this.client_avaiable = false;
                this.client_checked = true;

            }
            this.selectedProjectClient = res;

        })
    }

    /**
     * Reset the data attribute.
     */
    resetData(): void {
        if (this.data === 'INVALID') {
            return;
        }
        this.data = '';
    }

    /**
     * Initializes the data.
     * Gets all groups of the user and his key.
     */
    initializeData(): void {
        forkJoin(this.groupService.getMemberGroupsStatus(), this.keyservice.getKey()).subscribe(result => {
            this.userinfo.PublicKey = result[1]['public_key'];
            this.validatePublicKey();
            const membergroups = result[0];
            for (const project of membergroups) {
                this.projects.push(project);

            }
            this.isLoaded = true;
        })
    }

    /**
     * Get vms diskpace and used from the selected project.
     */
    getSelectedProjectDiskspace(): void {
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceMax = result['Diskspace'];

            } else if (result['Diskspace'] === null || result['Diskspace'] === 0) {
                this.selectedProjectDiskspaceMax = 0;
            }

        });
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => {
            if (result['Diskspace']) {

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            } else if (result['Diskspace'] === 0 || result['Diskspace'] == null) {
                this.selectedProjectDiskspaceUsed = 0;
            }

        })

    }

    /**
     * Get volumes max and used from the selected project.
     */
    getSelectedProjectVolumes(): void {
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => {
            if (result['VolumeCounter']) {
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            } else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) {
                this.selectedProjectVolumesMax = 0;
            }
        });
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => {
            if (result['UsedVolumes']) {
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            } else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) {

                this.selectedProjectVolumesUsed = 0;
            }

        })
    }

    /**
     * Get vms max and used from the selected project.
     */
    getSelectedProjectVms(): void {
        this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()).subscribe(result => {
            if (result['NumberVms']) {

                this.selectedProjectVmsMax = result['NumberVms'];

            } else if (result['NumberVms'] === null || result['NumberVms'] === 0) {
                this.selectedProjectVmsMax = 0;
            }

        });
        this.groupService.getGroupUsedVms(this.selectedProject[1].toString()).subscribe(result => {
            if (result['NumberVms']) {

                this.selectedProjectVmsUsed = result['NumberVms'];
            } else if (result['NumberVms'] === 0 || result['NumberVms'] == null) {
                this.selectedProjectVmsUsed = 0;
            }

        })

    }

    ngOnInit(): void {

        this.userinfo = new Userinfo();
        this.initializeData();

    }
}
