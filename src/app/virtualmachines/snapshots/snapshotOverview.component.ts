import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../api-connector/image.service';
import {SnapshotModel} from './snapshot.model';
import {forkJoin, Observable} from 'rxjs';
import {IResponseTemplate} from '../../api-connector/response-template';
import {VolumeRequestStates} from '../volumes/volume-request-states.enum';
import {FacilityService} from '../../api-connector/facility.service';

enum Snapshot_Delete_Statuses {
  WAITING = 0,
  SUCCESS = 1,
  ERROR = 2
}

/**
 * Snapshot overivew.
 */
@Component({
             selector: 'app-snapshot-overview',
             templateUrl: 'snapshotOverview.component.html',
             providers: [FacilityService, ImageService]
           })

export class SnapshotOverviewComponent implements OnInit {

  title: string = 'Snapshot Overview';

  showFacilities: boolean = false;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  selectedFacility: [string, number];

  /**
   * All snapshots.
   * @type {Array}
   */
  snapshots: SnapshotModel[] = [];
  /**
   * Selected snapshot.
   */
  selected_snapshot: SnapshotModel;
  /**
   * All possible statuses when deleting.
   * @type {Snapshot_Delete_Statuses}
   */
  delete_statuses: typeof Snapshot_Delete_Statuses = Snapshot_Delete_Statuses;
  /**
   * Actual delete status.
   * @type {Snapshot_Delete_Statuses}
   */
  delete_status: number = this.delete_statuses.WAITING;
  /**
   * If site was initialized.
   * @type {boolean}
   */
  isLoaded: boolean = false;

  private checkStatusTimeout: number = 5000;

  constructor(private facilityService: FacilityService, private imageService: ImageService) {

  }

  /**
   * Set selected Snapshot.
   * @param {SnapshotModel} snapshot
   */
  setSelectedSnapshot(snapshot: SnapshotModel): void {
    this.selected_snapshot = snapshot;
  }

  /**
   * Get snapshots by user.
   */
  getSnapshots(): void {
    this.snapshots = [];
    this.imageService.getSnapshotsByUser().subscribe((result: any) => {
      this.snapshots = result;
      this.isLoaded = true;
      this.checkSnapShotsStatus()
    })
  }

  checkSnapShotsStatus(): void {
    let all_active: boolean = true;

    setTimeout(
      () => {
        const observables: any = [];
        for (const snapshot of this.snapshots) {
          if (snapshot.snapshot_status !== 'active') {

            observables.push(this.imageService.getSnapshot(snapshot.snapshot_openstackid));
          }

        }
        forkJoin(observables).subscribe((res: any) => {
          for (const snap of res) {
            this.snapshots[res.indexOf(snap)].snapshot_status = snap['status'];
            if (snap['status'] !== 'active') {
              all_active = false;
            }

          }
          if (all_active) {
            return;
          } else {
            this.checkSnapShotsStatus();
          }
        })
      },
      this.checkStatusTimeout);

  }

  getFacilitySnapshots(): void {
    this.snapshots = [];
    this.facilityService.getFacilitySnapshots(this.selectedFacility['FacilityId']).subscribe((res: any) => {
      this.snapshots = res;
    })
  }

  /**
   * Delete snapshot.
   * @param {string} snapshot_id
   */
  deleteSnapshot(snapshot_id: string): void {
    this.imageService.deleteSnapshot(snapshot_id).subscribe((result: IResponseTemplate) => {

      this.delete_status = 0;

      if (<boolean><Boolean>result.value) {
        this.delete_status = 1;
      } else if (result.value) {
        this.delete_status = 3;

      } else {
        this.delete_status = 2;
      }

      this.getSnapshots();
    })

  }

  ngOnInit(): void {
    this.getSnapshots();
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

  }

}
