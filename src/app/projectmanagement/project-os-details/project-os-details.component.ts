import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../project.model';
import {VirtualMachine} from '../../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../../virtualmachines/volumes/volume';
import {SnapshotModel} from '../../virtualmachines/snapshots/snapshot.model';
import {GroupService} from '../../api-connector/group.service';

/**
 * Project OpenStack Details Component.
 */
@Component({
             selector: 'app-project-os-details',
             templateUrl: './project-os-details.component.html',
             styleUrls: ['./project-os-details.component.css'],
             providers: [GroupService]
           })
export class ProjectOsDetailsComponent implements OnInit {

  @Input() project: Project;
  selectedProjectVms: VirtualMachine[] = [];
  selectedProjectVolumes: Volume[] = [];
  selectedProjectSnapshots: SnapshotModel[] = [];

  constructor(private groupService: GroupService) {
  }

  ngOnInit(): void {
    this.getProjectDetails()
  }

  getProjectDetails(): void {
    this.groupService.getProjectOSDetails(this.project.Id).subscribe((res: any) => {
      this.selectedProjectVms = res['vms'];
      this.selectedProjectVolumes = res['volumes'];
      this.selectedProjectSnapshots = res['snapshots'];
    })
  }

}
