import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ImageService***REMOVED*** from "../api-connector/image.service";
import ***REMOVED***SnapshotModel***REMOVED*** from "./virtualmachinemodels/snapshot.model";


@Component(***REMOVED***
    selector: 'snapshot-overview',
    templateUrl: 'snapshotOverview.component.html',
    providers: [ImageService]
***REMOVED***)

export class SnapshotOverviewComponent implements OnInit ***REMOVED***
    snapshots: SnapshotModel[];
    selected_snapshot: SnapshotModel;
    delete_status = 0;
    isLoaded=false;


    constructor(private imageService: ImageService) ***REMOVED***

    ***REMOVED***

    setSelectedSnapshot(snapshot: SnapshotModel) ***REMOVED***
        this.selected_snapshot = snapshot;
    ***REMOVED***

    getSnapshots() ***REMOVED***
        this.imageService.getSnapshotsByUser().subscribe(result => ***REMOVED***
            this.snapshots = result;
            this.isLoaded=true;
        ***REMOVED***)
    ***REMOVED***

    deleteSnapshot(snapshot_id: string) ***REMOVED***
        this.imageService.deleteSnapshot(snapshot_id).subscribe(result => ***REMOVED***

            this.delete_status = 0;


            if (result['Deleted'] && result['Deleted'] === true) ***REMOVED***
                this.delete_status = 1;
            ***REMOVED***
            else ***REMOVED***
                this.delete_status = 2;
            ***REMOVED***

            this.getSnapshots();
        ***REMOVED***)

    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.getSnapshots()

    ***REMOVED***

***REMOVED***
