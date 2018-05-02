import {Component, OnInit, TemplateRef} from '@angular/core';
import {Image} from "./virtualmachinemodels/image";
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {Flavor} from './virtualmachinemodels/flavor';
import {ImageService} from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {ImageDetailComponent} from "./imagedetail.component";
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {Metadata} from './virtualmachinemodels/metadata';
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {ApplicationsService} from '../api-connector/applications.service'
import {Userinfo} from "../userinfo/userinfo.model";
import {ApiSettings} from "../api-connector/api-settings.service";
import {MembersManager} from "../perun-connector/members-manager.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";

import {ClientService} from "../api-connector/vmClients.service";
import {Vmclient} from "./virtualmachinemodels/vmclient";
import {GroupsManager} from "../perun-connector/groups-manager.service";
import {AttributesManager} from "../perun-connector/attributes-manager";
import {Application} from "../applications/application.model";
import {keyService} from "../api-connector/key.service";
import {Project} from "../projectmanagement/project.model";

@Component({
    selector: 'new-vm',
    templateUrl: 'addvm.component.html',
    providers: [ImageService, keyService, FlavorService, VirtualmachineService, ApplicationsService, AttributesManager, Application, AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, ClientService, GroupsManager]
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
    selectedProject: [string, number];
    client_avaiable: boolean;
    projects: string[] = new Array();
    private checkStatusTimeout: number = 5000;


    constructor(private imageService: ImageService, private attributemanager: AttributesManager, private applicataionsservice: ApplicationsService, private  flavorService: FlavorService, private groupsmanager: GroupsManager, private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private  keyService: keyService, private clientservice: ClientService) {
    }


    getImages(): void {
        this.imageService.getImages(this.vmclient.host, this.vmclient.port).subscribe(images => this.images = images);
    }

    getFlavors(): void {
        this.flavorService.getFlavors(this.vmclient.host, this.vmclient.port).subscribe(flavors => this.flavors = flavors);

    }

    getClientData() {
        this.clientservice.getClientsChecked().subscribe(response => {
            this.getRRFirstClient();

        })
    }

    getRRFirstClient(): void {
        this.clientservice.getRRFirstClient().subscribe(client => {
                this.vmclient = client;
                if (this.vmclient.status === "Connected") {
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
            return true;
        }
        else {

            return false;
        }

    }

    getUserPublicKey() {
        this.keyService.getKey(this.userinfo.ElxirId).subscribe(result => {
            this.userinfo.PublicKey = result.toString();
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

        setTimeout( () => {
            this.virtualmachineservice.checkVmStatus(id).subscribe(res => {
                res = res.json()
                if (res['Started'] || res['Error']) {
                    this.data = res


                }
                else {
                    this.check_status_loop(id)
                }

            })
        }, this.checkStatusTimeout);
    }

    startVM(flavor: string, image: string, servername: string, project: string, projectid: string, diskspace?: string): void {
        if (image && flavor && servername && project) {


            this.virtualmachineservice.startVM(flavor, image, servername, this.vmclient.host, this.vmclient.port, project, projectid, diskspace).subscribe(data => {

                if (data.json()['Created']) {
                    this.check_status_loop(data.json()['Created']);
                }
                else {
                    this.data = data.json()
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
        this.groupsmanager.getMemberGroupsStatus().toPromise().then(membergroups => {
            for (let project of membergroups.json()) {
                this.projects.push(project);

            }
        });
    }

    ngOnInit(): void {

        this.userinfo = new Userinfo();
        this.getClientData();
        this.getUserApprovedProjects();
        this.getUserPublicKey();


    }
}
