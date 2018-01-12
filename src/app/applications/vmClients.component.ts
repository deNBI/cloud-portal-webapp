import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachinemodels/vmclient";
import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupsManager***REMOVED*** from "../perun-connector/groups-manager.service";


@Component(***REMOVED***
  selector: 'client-overview',
  templateUrl: 'vmClients.component.html',
  providers: [ClientService, AuthzResolver, UsersManager, PerunSettings, ApiSettings, GroupsManager]
***REMOVED***)

export class ClientOverviewComponent implements OnInit ***REMOVED***
  clients: Vmclient[];
  is_vo_admin = false;
  checkStatus: string = 'Not checked';

  constructor(private groupsmanager: GroupsManager, private clientservice: ClientService, private perunsettings: PerunSettings, private usersmanager: UsersManager, private authzresolver: AuthzResolver) ***REMOVED***

  ***REMOVED***

  checkVOstatus(usersmanager: UsersManager) ***REMOVED***
    let user_id: number;
    let admin_vos: ***REMOVED******REMOVED***;
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) ***REMOVED***
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      ***REMOVED***).then(function (adminvos) ***REMOVED***
      admin_vos = adminvos.json();
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
    this.clientservice.getClientsChecked().subscribe(clients => this.clients = clients);


  ***REMOVED***

  checkClient(host: string, port: string): void ***REMOVED***
    if (host && port) ***REMOVED***
      this.clientservice.checkClient(host, port).subscribe(data => ***REMOVED***
        console.log(data.text());
        if (data.text() == "false") ***REMOVED***
          this.checkStatus = 'No Connection';
        ***REMOVED***
        else if (data.text() == 'true') ***REMOVED***
          this.checkStatus = "Connected";
        ***REMOVED***
        else ***REMOVED***
          this.checkStatus = "check failed";
          console.log(data.text())
        ***REMOVED***

      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

  postClient(host: string, port: string, location: string): void ***REMOVED***


    this.clientservice.postClient(host, port, location).subscribe(data => ***REMOVED***
      console.log(data.text());
      this.getClientsChecked();
    ***REMOVED***);
  ***REMOVED***

  deleteClient(host: string, port: string, location: string): void ***REMOVED***
    this.clientservice.deleteClient(host, port, location).subscribe(data => ***REMOVED***
      console.log(data.text());
      this.getClientsChecked();
    ***REMOVED***);
  ***REMOVED***


  ngOnInit(): void ***REMOVED***
    this.checkVOstatus(this.usersmanager);
    this.getClientsChecked();

  ***REMOVED***

***REMOVED***
