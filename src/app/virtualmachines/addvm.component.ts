import ***REMOVED***
    Component, OnInit, TemplateRef, ViewChild,
    AfterViewInit,
    ElementRef
***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from "./virtualmachinemodels/image";
import ***REMOVED***ModalDirective***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';

import ***REMOVED***Metadata***REMOVED*** from './virtualmachinemodels/metadata';
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Userinfo***REMOVED*** from "../userinfo/userinfo.model";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";

import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***Vmclient***REMOVED*** from "./virtualmachinemodels/vmclient";
import ***REMOVED***Application***REMOVED*** from "../applications/application.model";
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***environment***REMOVED*** from "../../environments/environment";
import ***REMOVED***UserinfoComponent***REMOVED*** from '../userinfo/userinfo.component';

@Component(***REMOVED***
    selector: 'new-vm',
    templateUrl: 'addvm.component.html',
    providers: [GroupService, ImageService, keyService, FlavorService, VirtualmachineService, ApplicationsService, Application, PerunSettings, ApiSettings, keyService, ClientService],
***REMOVED***)
export class VirtualMachineComponent implements OnInit ***REMOVED***


    data: string = "";
    creating_vm_status = 'Creating..';
    creating_vm_prograss_bar = 'progress-bar-animated';
    checking_vm_status = '';
    checking_vm_status_width = 0;
    checking_vm_status_progress_bar = 'progress-bar-animated';
    checking_vm_ssh_port = '';
    checking_vm_ssh_port_width = 0;

    informationButton: string = "Show Details";
    informationButton2: string = "Show Details";
    images: Image[];
    metadatalist: Metadata [] = [];
    flavors: Flavor[];
    selectedImage: Image;
    selectedFlavor: Flavor;
    userinfo: Userinfo;
    vmclient: Vmclient;
    selectedProjectClient: Vmclient;
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


    constructor(private groupService: GroupService, private imageService: ImageService, private applicataionsservice: ApplicationsService, private  flavorService: FlavorService, private virtualmachineservice: VirtualmachineService, private  keyService: keyService, private clientservice: ClientService) ***REMOVED***
    ***REMOVED***


    getImages(project_id: number): void ***REMOVED***

        this.imageService.getImages(project_id).subscribe(images => this.images = images);
    ***REMOVED***

    getFlavors(project_id: number): void ***REMOVED***
        this.flavorService.getFlavors(project_id).subscribe(flavors => this.flavors = flavors);

    ***REMOVED***


    getClientData() ***REMOVED***
        this.clientservice.getClientsChecked().subscribe(response => ***REMOVED***
            this.getRRFirstClient();


        ***REMOVED***)
    ***REMOVED***

    getRRFirstClient(): void ***REMOVED***
        this.clientservice.isClientAvaiable().subscribe(client => ***REMOVED***
                if (client.toString() === "true") ***REMOVED***

                    this.client_avaiable = true;

                ***REMOVED***
                else ***REMOVED***
                    this.client_avaiable = false;
                ***REMOVED***


            ***REMOVED***
        )
        ;
    ***REMOVED***

    validatePublicKey() ***REMOVED***

        if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)) ***REMOVED***
            this.validPublickey = true;
        ***REMOVED***
        else ***REMOVED***

            this.validPublickey = false;
        ***REMOVED***


    ***REMOVED***

    getUserPublicKey() ***REMOVED***
        this.keyService.getKey().subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result['public_key'];
        ***REMOVED***)
    ***REMOVED***

    toggleInformationButton(): void ***REMOVED***
        if (this.informationButton == "Show Details") ***REMOVED***
            this.informationButton = "Hide Details";
        ***REMOVED*** else ***REMOVED***
            this.informationButton = "Show Details";
        ***REMOVED***

    ***REMOVED***

    toggleInformationButton2(): void ***REMOVED***
        if (this.informationButton2 == "Show Details") ***REMOVED***
            this.informationButton2 = "Hide Details";
        ***REMOVED*** else ***REMOVED***
            this.informationButton2 = "Show Details";
        ***REMOVED***

    ***REMOVED***

    resetProgressBar() ***REMOVED***
        this.creating_vm_status = 'Creating..';
        this.creating_vm_prograss_bar = 'progress-bar-animated';
        this.checking_vm_status = '';
        this.checking_vm_status_width = 0;
        this.checking_vm_status_progress_bar = 'progress-bar-animated';
        this.checking_vm_ssh_port = '';
        this.checking_vm_ssh_port_width = 0;
    ***REMOVED***

    check_status_loop(id: string) ***REMOVED***

        setTimeout(() => ***REMOVED***
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => ***REMOVED***
                res = res;

                if (res['Started'] || res['Error']) ***REMOVED***
                    this.resetProgressBar();
                    this.data = res;
                    this.getSelectedProjectDiskspace();
                    this.getSelectedProjectVms();
                    this.getSelectedProjectVolumes();


                ***REMOVED***
                else ***REMOVED***
                    if (res['Waiting'] == 'PORT_CLOSED') ***REMOVED***
                        this.checking_vm_status = 'Active';
                        this.checking_vm_status_progress_bar = '';
                        this.creating_vm_prograss_bar = '';
                        this.checking_vm_ssh_port = 'Checking port..';
                        this.checking_vm_ssh_port_width = 34;


                    ***REMOVED***
                    this.check_status_loop(id)
                ***REMOVED***

            ***REMOVED***)
        ***REMOVED***, this.checkStatusTimeout);
    ***REMOVED***

    startVM(flavor: string, image: string, servername: string, project: string, projectid: string): void ***REMOVED***
        if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) ***REMOVED***
            let re = /\+/gi;

            let flavor_fixed = flavor.replace(re, "%2B");


            this.virtualmachineservice.startVM(flavor_fixed, image, servername, project, projectid, this.volumeName, this.diskspace.toString()).subscribe(data => ***REMOVED***


                if (data['Created']) ***REMOVED***
                    this.creating_vm_status = 'Created';
                    this.creating_vm_prograss_bar = '';
                    this.checking_vm_status = 'Checking status..';
                    this.checking_vm_status_progress_bar = 'progress-bar-animated';
                    this.checking_vm_status_width = 33;

                    this.check_status_loop(data['Created']);
                ***REMOVED***
                else ***REMOVED***
                    this.creating_vm_status = 'Creating';

                    this.data = data
                ***REMOVED***


            ***REMOVED***);

        ***REMOVED***
        else ***REMOVED***
            this.creating_vm_status = 'Creating';

            this.data = "INVALID"

        ***REMOVED***
    ***REMOVED***

    getSelectedProjectClient(groupid: number) ***REMOVED***
        this.groupService.getClient(this.selectedProject[1].toString()).subscribe(res => ***REMOVED***
            if (res['status'] == 'Connected') ***REMOVED***
                this.client_avaiable = true;

                this.getSelectedProjectDiskspace();
                this.getSelectedProjectVms();
                this.getSelectedProjectVolumes();
                this.getImages(this.selectedProject[1]);
                this.getFlavors(this.selectedProject[1]);
            ***REMOVED***
            else ***REMOVED***
                this.client_avaiable = false;

            ***REMOVED***
            this.selectedProjectClient = res;

        ***REMOVED***)
    ***REMOVED***


    resetData(): void ***REMOVED***
        if (this.data == 'INVALID') ***REMOVED***
            return;
        ***REMOVED***
        this.data = '';
    ***REMOVED***

    resetData2(): void ***REMOVED***
        this.data = '';
    ***REMOVED***

    onSelectFlavor(flavor: Flavor): void ***REMOVED***
        this.selectedFlavor = flavor;
    ***REMOVED***

    onSelectImage(image: Image): void ***REMOVED***
        this.selectedImage = image
    ***REMOVED***

    checkMetadataKeys(key: string): boolean ***REMOVED***
        for (let metadata of this.metadatalist) ***REMOVED***
            if (metadata.key == key) ***REMOVED***
                return false;
            ***REMOVED***
        ***REMOVED***
        return true;
    ***REMOVED***


    addMetadataItem(key: string, value: string): void ***REMOVED***
        if (key && value && this.checkMetadataKeys(key)) ***REMOVED***
            this.metadatalist.push(new Metadata(key, value));
        ***REMOVED***

    ***REMOVED***

    deleteMetadataItem(metadata: Metadata): void ***REMOVED***
        this.metadatalist.splice(this.metadatalist.indexOf(metadata), 1);
    ***REMOVED***

    getUserApprovedProjects() ***REMOVED***
        this.groupService.getMemberGroupsStatus().subscribe(membergroups => ***REMOVED***
            for (let project of membergroups) ***REMOVED***
                this.projects.push(project);

            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    initializeData() ***REMOVED***
        forkJoin(this.groupService.getMemberGroupsStatus(), this.keyService.getKey()).subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result[1]['public_key'];
            this.validatePublicKey();
            let membergroups = result[0];
            for (let project of membergroups) ***REMOVED***
                this.projects.push(project);

            ***REMOVED***
            this.isLoaded = true;
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
            if (result['UsedVolumes']) ***REMOVED***
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            ***REMOVED***
            else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) ***REMOVED***

                this.selectedProjectVolumesUsed = 0;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***


    getSelectedProjectVms(): void ***REMOVED***
        this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['NumberVms']) ***REMOVED***


                this.selectedProjectVmsMax = result['NumberVms'];

            ***REMOVED***
            else if (result['NumberVms'] === null || result['NumberVms'] === 0) ***REMOVED***
                this.selectedProjectVmsMax = 0;
            ***REMOVED***

        ***REMOVED***)
        this.groupService.getGroupUsedVms(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['NumberVms']) ***REMOVED***

                this.selectedProjectVmsUsed = result['NumberVms'];
            ***REMOVED***
            else if (result['NumberVms'] == 0 || result['NumberVms'] == null) ***REMOVED***
                this.selectedProjectVmsUsed = 0;
            ***REMOVED***


        ***REMOVED***)

    ***REMOVED***

    ngOnInit(): void ***REMOVED***

        this.userinfo = new Userinfo();
        this.initializeData();


    ***REMOVED***
***REMOVED***
