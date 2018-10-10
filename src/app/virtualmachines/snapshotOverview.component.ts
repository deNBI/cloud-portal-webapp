import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ImageService} from "../api-connector/image.service";
import {SnapshotModel} from "./virtualmachinemodels/snapshot.model";


@Component({
    selector: 'snapshot-overview',
    templateUrl: 'snapshotOverview.component.html',
    providers: [ImageService]
})

export class SnapshotOverviewComponent implements OnInit {
    snapshots: SnapshotModel[];
    selected_snapshot: SnapshotModel;
    delete_status = 0;
    isLoaded=false;


    constructor(private imageService: ImageService) {

    }

    setSelectedSnapshot(snapshot: SnapshotModel) {
        this.selected_snapshot = snapshot;
    }

    getSnapshots() {
        this.imageService.getSnapshotsByUser().subscribe(result => {
            this.snapshots = result;
            this.isLoaded=true;
        })
    }

    deleteSnapshot(snapshot_id: string) {
        this.imageService.deleteSnapshot(snapshot_id).subscribe(result => {

            this.delete_status = 0;


            if (result['Deleted'] && result['Deleted'] === true) {
                this.delete_status = 1;
            }
            else {
                this.delete_status = 2;
            }

            this.getSnapshots();
        })

    }


    ngOnInit(): void {
        this.getSnapshots()

    }

}
