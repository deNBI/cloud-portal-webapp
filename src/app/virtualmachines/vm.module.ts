import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***VmRoutingModule***REMOVED*** from './vm_routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***ImageDetailComponent***REMOVED*** from '../virtualmachines/imagedetail.component';
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../virtualmachines/addvm.component';
import ***REMOVED***FlavorDetailComponent***REMOVED*** from '../virtualmachines/flavordetail.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from './clients/vmClients.component';
import ***REMOVED***VmOverviewComponent***REMOVED*** from '../virtualmachines/vmOverview.component';
import ***REMOVED***VolumeOverviewComponent***REMOVED*** from './volumes/volumeOverview.component';
import ***REMOVED***SnapshotOverviewComponent***REMOVED*** from './snapshots/snapshotOverview.component';
import ***REMOVED***PaginationModule***REMOVED*** from 'ngx-bootstrap/pagination'
import ***REMOVED***PublicKeyModule***REMOVED*** from '../shared/shared_modules/public-key/public-key.module';
import ***REMOVED***ClickOutsideModule***REMOVED*** from 'ng4-click-outside';
import ***REMOVED*** BsDropdownModule ***REMOVED*** from 'ngx-bootstrap';

/**
 * VM module.
 */
@NgModule(***REMOVED***
    imports: [
        ClickOutsideModule,
        PublicKeyModule,
        VmRoutingModule,
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot()

    ],
    declarations: [
        ImageDetailComponent,
        VirtualMachineComponent,
        FlavorDetailComponent,
        ClientOverviewComponent,
        VmOverviewComponent,
        VolumeOverviewComponent,
        SnapshotOverviewComponent
    ]
***REMOVED***)
export class VmModule ***REMOVED***
***REMOVED***
