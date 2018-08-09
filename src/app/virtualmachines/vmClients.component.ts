import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***Vmclient***REMOVED*** from "./virtualmachinemodels/vmclient";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";


@Component(***REMOVED***
    selector: 'client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [UserService, GroupService, ClientService, PerunSettings, ApiSettings]
***REMOVED***)

export class ClientOverviewComponent implements OnInit ***REMOVED***
    clients: Vmclient[];
    is_vo_admin = false;
    checkStatus: string = 'Not checked';
    computeCenters: [string, number][];
    selectedComputeCenter: string;
    isLoaded = false;

    constructor(private userservice: UserService, private groupservice: GroupService, private clientservice: ClientService, private perunsettings: PerunSettings) ***REMOVED***

    ***REMOVED***

    checkVOstatus(userservice: UserService) ***REMOVED***
        let user_id: number;
        let admin_vos: ***REMOVED******REMOVED***;
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                //TODO catch errors
                user_id = userdata["id"];
                return userservice.getVosWhereUserIsAdmin().toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos;
        ***REMOVED***).then(result => ***REMOVED***
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) ***REMOVED***
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
                    this.is_vo_admin = true;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    getClientsUnchecked(): void ***REMOVED***
        this.clientservice.getClientsUnchecked().subscribe(clients => this.clients = clients);

    ***REMOVED***

    getClientsChecked(): void ***REMOVED***
        this.clientservice.getClientsChecked().subscribe(clients => ***REMOVED***
            this.clients = clients;
            this.isLoaded=true;
        ***REMOVED***);


    ***REMOVED***

    getComputeCenters() ***REMOVED***
        this.groupservice.getComputeCenters().subscribe(result => ***REMOVED***
            this.computeCenters = result;

        ***REMOVED***)
    ***REMOVED***

    checkClient(host: string, port: string): void ***REMOVED***
        if (host && port) ***REMOVED***
            this.clientservice.checkClient(host, port).subscribe(data => ***REMOVED***

                if (data['status'] == false) ***REMOVED***
                    this.checkStatus = 'No Connection';
                ***REMOVED***
                else if (data['status'] == true) ***REMOVED***
                    this.checkStatus = "Connected";
                ***REMOVED***
                else ***REMOVED***
                    this.checkStatus = "check failed";

                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

    postClient(host: string, port: string, location: string): void ***REMOVED***


        if (host && port && location) ***REMOVED***
            this.clientservice.postClient(host, port, location).subscribe(data => ***REMOVED***

                this.getClientsChecked();
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

    deleteClient(host: string, port: string, location: string): void ***REMOVED***
        this.clientservice.deleteClient(host, port, location).subscribe(data => ***REMOVED***

            this.getClientsChecked();
        ***REMOVED***);
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.checkVOstatus(this.userservice);
        this.getClientsChecked();
        this.getComputeCenters();

    ***REMOVED***

***REMOVED***
