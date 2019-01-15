import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ImageService***REMOVED*** from "../api-connector/image.service";
import ***REMOVED***SnapshotModel***REMOVED*** from "./virtualmachinemodels/snapshot.model";
import ***REMOVED***Image***REMOVED*** from "./virtualmachinemodels/image";
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';

enum Snapshot_Delete_Statuses ***REMOVED***
    WAITING = 0,
    SUCCESS = 1,
    ERROR = 2
***REMOVED***

@Component(***REMOVED***
    selector: 'snapshot-overview',
    templateUrl: 'snapshotOverview.component.html',
    providers: [ImageService]
***REMOVED***)

export class SnapshotOverviewComponent implements OnInit ***REMOVED***
    /**
     * All snapshots.
     * @type ***REMOVED***Array***REMOVED***
     */
    snapshots: SnapshotModel[] = [];
    /**
     * Selected snapshot.
     */
    selected_snapshot: SnapshotModel;
    /**
     * All possible statuses when deleting.
     * @type ***REMOVED***Snapshot_Delete_Statuses***REMOVED***
     */
    delete_statuses = Snapshot_Delete_Statuses;
    /**
     * Actual delete status.
     * @type ***REMOVED***Snapshot_Delete_Statuses***REMOVED***
     */
    delete_status = this.delete_statuses.WAITING;
    /**
     * If site was initialized.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded = false;

    private checkStatusTimeout: number = 5000;


    constructor(private imageService: ImageService) ***REMOVED***

    ***REMOVED***

    /**
     * Set selected Snapshot.
     * @param ***REMOVED***SnapshotModel***REMOVED*** snapshot
     */
    setSelectedSnapshot(snapshot: SnapshotModel) ***REMOVED***
        this.selected_snapshot = snapshot;
    ***REMOVED***


    /**
     * Get snapshots by user.
     */
    getSnapshots() ***REMOVED***
        this.imageService.getSnapshotsByUser().subscribe(result => ***REMOVED***
            this.snapshots = result;
            this.isLoaded = true;
            this.checkSnapShotsStatus()
        ***REMOVED***)
    ***REMOVED***


    checkSnapShotsStatus() ***REMOVED***
        let all_active = true;

        setTimeout(() => ***REMOVED***
            let observables = [];
            for (let s of this.snapshots) ***REMOVED***

                observables.push(this.imageService.getSnapshot(s.snapshot_openstackid));

            ***REMOVED***
            forkJoin(observables).subscribe(res => ***REMOVED***
                for (let i of res) ***REMOVED***
                    this.snapshots[res.indexOf(i)].snapshot_status = i['status'];
                    if (i['status'] != 'active') ***REMOVED***
                        all_active = false;
                    ***REMOVED***

                ***REMOVED***
                if (all_active) ***REMOVED***
                    return;
                ***REMOVED***
                else ***REMOVED***
                    this.checkSnapShotsStatus();
                ***REMOVED***
            ***REMOVED***)
        ***REMOVED***, this.checkStatusTimeout);

    ***REMOVED***

    /**
     * Delete snapshot.
     * @param ***REMOVED***string***REMOVED*** snapshot_id
     */
    deleteSnapshot(snapshot_id: string) ***REMOVED***
        this.imageService.deleteSnapshot(snapshot_id).subscribe(result => ***REMOVED***

            this.delete_status = 0;


            if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                this.delete_status = 1;
            ***REMOVED***
            else if (result['Info']) ***REMOVED***
                this.delete_status = 3;

            ***REMOVED*** else ***REMOVED***
                this.delete_status = 2;
            ***REMOVED***

            this.getSnapshots();
        ***REMOVED***)

    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.getSnapshots()

    ***REMOVED***

***REMOVED***
