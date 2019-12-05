import {NgModule} from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {VmRoutingModule} from './vm_routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageDetailComponent} from '../virtualmachines/imagedetail.component';
import {VirtualMachineComponent} from '../virtualmachines/addvm.component';
import {FlavorDetailComponent} from '../virtualmachines/flavordetail.component';
import {ClientOverviewComponent} from './clients/clientOverview.component';
import {VmOverviewComponent} from '../virtualmachines/vmOverview.component';
import {VolumeOverviewComponent} from './volumes/volumeOverview.component';
import {SnapshotOverviewComponent} from './snapshots/snapshotOverview.component';
import {PaginationModule} from 'ngx-bootstrap/pagination'
import {PublicKeyModule} from '../shared/shared_modules/public-key/public-key.module';
import {ClickOutsideModule} from 'ng4-click-outside';
import {AccordionModule, BsDropdownModule} from 'ngx-bootstrap';
import {BiocondaComponent} from './conda/bioconda.component';
import {HowToConnectComponent} from './shared-modal/how-to-connect.component';
import {SharedDirectivesModule} from '../shared/shared_modules/shared_directives.module';
import {ImageCarouselSlideComponent} from './imageCarouselSlide.component';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ResEnvComponent} from './conda/res-env.component';

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
              PopoverModule.forRoot(), NgbModule,
              ReactiveFormsModule

            ],
            declarations: [
              ImageCarouselSlideComponent,
              ImageDetailComponent,
              VirtualMachineComponent,
              FlavorDetailComponent,
              ClientOverviewComponent,
              VmOverviewComponent,
              VolumeOverviewComponent,
              SnapshotOverviewComponent,
              HowToConnectComponent,
              BiocondaComponent,
              ResEnvComponent
            ]
          })
export class VmModule {
}
