import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***CarouselModule***REMOVED*** from 'ngx-owl-carousel-o';
import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***VmRoutingModule***REMOVED*** from './vm_routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***ImageDetailComponent***REMOVED*** from '../virtualmachines/imagedetail.component';
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../virtualmachines/addvm.component';
import ***REMOVED***FlavorDetailComponent***REMOVED*** from '../virtualmachines/flavordetail.component';
import ***REMOVED***ClientOverviewComponent***REMOVED*** from './clients/clientOverview.component';
import ***REMOVED***VmOverviewComponent***REMOVED*** from '../virtualmachines/vmOverview.component';
import ***REMOVED***VolumeOverviewComponent***REMOVED*** from './volumes/volumeOverview.component';
import ***REMOVED***SnapshotOverviewComponent***REMOVED*** from './snapshots/snapshotOverview.component';
import ***REMOVED***PaginationModule***REMOVED*** from 'ngx-bootstrap/pagination'
import ***REMOVED***PublicKeyModule***REMOVED*** from '../shared/shared_modules/public-key/public-key.module';
import ***REMOVED***ClickOutsideModule***REMOVED*** from 'ng4-click-outside';
import ***REMOVED***AccordionModule, BsDropdownModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***BiocondaComponent***REMOVED*** from './conda/bioconda.component';
import ***REMOVED***HowToConnectComponent***REMOVED*** from './shared-modal/how-to-connect.component';
import ***REMOVED***PopoverModule***REMOVED*** from 'ngx-smart-popover';

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
              BsDropdownModule.forRoot(),
              CarouselModule,
              AccordionModule.forRoot(),
              PopoverModule

            ],
            declarations: [
              ImageDetailComponent,
              VirtualMachineComponent,
              FlavorDetailComponent,
              ClientOverviewComponent,
              VmOverviewComponent,
              VolumeOverviewComponent,
              SnapshotOverviewComponent,
              HowToConnectComponent,
              BiocondaComponent
            ]
          ***REMOVED***)
export class VmModule ***REMOVED***
***REMOVED***
