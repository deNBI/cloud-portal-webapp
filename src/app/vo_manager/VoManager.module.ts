import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';

import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***VoManagerRoutingModule***REMOVED*** from './VoManager-routing.module';
import ***REMOVED***VoOverviewComponent***REMOVED*** from './VoOverviewComponent';
import ***REMOVED***VoGuardService***REMOVED*** from './vo-guard.service';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED*** ResourcesComponent ***REMOVED*** from './resources/resources.component';

@NgModule(***REMOVED***
  imports: [
   VoManagerRoutingModule,
    TabsModule,
      FormsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    VoOverviewComponent,
    ResourcesComponent
  ],
    providers: [
        VoService,
        VoGuardService

    ]
***REMOVED***)
export class VoManagerModule ***REMOVED*** ***REMOVED***
