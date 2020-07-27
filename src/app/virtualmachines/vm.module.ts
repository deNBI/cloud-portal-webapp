import {NgModule} from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {VmRoutingModule} from './vm_routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from './imagedetail.component';
import {VirtualMachineComponent} from './addvm.component';
import {FlavorDetailComponent} from './flavordetail.component';
import {VmOverviewComponent} from './vmOverview.component';
import {VolumeOverviewComponent} from './volumes/volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshots/snapshotOverview.component';
import {PaginationModule} from 'ngx-bootstrap/pagination'
import {PublicKeyModule} from '../shared/shared_modules/public-key/public-key.module';
import {ClickOutsideModule} from 'ng4-click-outside';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {BiocondaComponent} from './conda/bioconda.component';
import {SharedDirectivesModule} from '../shared/shared_modules/shared_directives.module';
import {ImageCarouselSlideComponent} from './imageCarouselSlide.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {VmDetailComponent} from './vmdetail/vmdetail.component';
import {AddClusterComponent} from './clusters/add-cluster/add-cluster.component';
import {ResourceOverviewComponent} from './resource-overview/resource-overview.component';
import {ResEnvComponent} from './conda/res-env.component';
import {ClusterdetailComponent} from './clusters/clusterdetail/clusterdetail.component';
import {VirtualmachineinfoComponent} from './vmdetail/virtualmachineinfo/virtualmachineinfo.component';
import {VmstatusComponent} from './vmdetail/vmstatus/vmstatus.component';
import {ClusterOverviewComponent} from './clusters/clusteroverview/clusterOverview.component';
import {ClusterinfoComponent} from './clusters/clusterinfo/clusterinfo.component';
import {ClusterstatusComponent} from './clusters/clusterstatus/clusterstatus.component';
import {VolumStatusComponent} from './volumes/volum-status/volum-status.component';

/**
 * VM module.
 */
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
              BsDropdownModule.forRoot(),
              CarouselModule,
              AccordionModule.forRoot(),
              SharedDirectivesModule,
              NgbModule,
              ReactiveFormsModule],
            declarations: [
              ImageCarouselSlideComponent,
              ImageDetailComponent,
              VirtualMachineComponent,
              FlavorDetailComponent,
              VmOverviewComponent,
              VolumeOverviewComponent,
              SnapshotOverviewComponent,
              ClusterstatusComponent,
              BiocondaComponent,
              VmDetailComponent,
              AddClusterComponent,
              ResourceOverviewComponent,
              ResEnvComponent,
              ClusterinfoComponent,
              ClusterdetailComponent,
              ClusterOverviewComponent,
              VirtualmachineinfoComponent,
              VmstatusComponent,
              VolumStatusComponent
            ]
          })
export class VmModule {
}
