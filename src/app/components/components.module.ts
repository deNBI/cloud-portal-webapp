import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** ButtonsComponent ***REMOVED*** from './buttons.component';
import ***REMOVED*** CardsComponent ***REMOVED*** from './cards.component';

// Forms Component
import ***REMOVED*** FormsComponent ***REMOVED*** from './forms.component';
import ***REMOVED*** BsDropdownModule ***REMOVED*** from 'ngx-bootstrap/dropdown';

import ***REMOVED*** SocialButtonsComponent ***REMOVED*** from './social-buttons.component';
import ***REMOVED*** SwitchesComponent ***REMOVED*** from './switches.component';
import ***REMOVED*** TablesComponent ***REMOVED*** from './tables.component';

// Modal Component
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED*** ModalsComponent ***REMOVED*** from './modals.component';

// Tabs Component
import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** TabsComponent ***REMOVED*** from './tabs.component';

// Components Routing
import ***REMOVED*** ComponentsRoutingModule ***REMOVED*** from './components-routing.module';

@NgModule(***REMOVED***
  imports: [
    ComponentsRoutingModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule
  ],
  declarations: [
    ButtonsComponent,
    CardsComponent,
    FormsComponent,
    ModalsComponent,
    SocialButtonsComponent,
    SwitchesComponent,
    TablesComponent,
    TabsComponent
  ]
***REMOVED***)
export class ComponentsModule ***REMOVED*** ***REMOVED***
