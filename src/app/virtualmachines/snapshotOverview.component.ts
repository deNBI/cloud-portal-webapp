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
import {ImageService} from "../api-connector/image.service";
import {SnapshotModel} from "./virtualmachinemodels/snapshot.model";


@Component({
  selector: 'snapshot-overview',
  templateUrl: 'snapshotOverview.component.html',
  providers: [ImageService]
})

export class SnapshotOverviewComponent implements OnInit {
  snapshots: SnapshotModel[];


  constructor(private imageService:ImageService) {

  }

  getSnapshots(){
      this.imageService.getSnapshotsByUser().subscribe(result =>{
          this.snapshots=result
      })
  }
  deleteSnapshot(snapshot_id:string){
      this.imageService.deleteSnapshot(snapshot_id).subscribe(result =>{
          this.getSnapshots();
      })

  }


  ngOnInit(): void {
    this.getSnapshots()

  }

}
