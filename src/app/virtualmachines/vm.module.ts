import {NgModule} from '@angular/core';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {VmRoutingModule} from './vm_routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from '../virtualmachines/imagedetail.component';
import {VirtualMachineComponent} from '../virtualmachines/addvm.component';
import {FlavorDetailComponent} from '../virtualmachines/flavordetail.component';
import {ClientOverviewComponent} from '../virtualmachines/vmClients.component';
import {VmOverviewComponent} from '../virtualmachines/vmOverview.component';
import {VolumeOverviewComponent} from './volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshotOverview.component';
import {PaginationModule} from 'ngx-bootstrap/pagination'
import {UserinfoModule} from '../userinfo/userinfo.module';
import {PublicKeyModule} from '../shared_modules/public-key/public-key.module';
import {ClickOutsideModule} from 'ng4-click-outside';

@NgModule({
    imports: [
        ClickOutsideModule,
        PublicKeyModule,
        VmRoutingModule,
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),


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
})
export class VmModule {
}
