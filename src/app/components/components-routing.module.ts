import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** ButtonsComponent ***REMOVED*** from './buttons.component';
import ***REMOVED*** CardsComponent ***REMOVED*** from './cards.component';
import ***REMOVED*** FormsComponent ***REMOVED*** from './forms.component';
import ***REMOVED*** ModalsComponent ***REMOVED*** from './modals.component';
import ***REMOVED*** SocialButtonsComponent ***REMOVED*** from './social-buttons.component';
import ***REMOVED*** SwitchesComponent ***REMOVED*** from './switches.component';
import ***REMOVED*** TablesComponent ***REMOVED*** from './tables.component';
import ***REMOVED*** TabsComponent ***REMOVED*** from './tabs.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    data: ***REMOVED***
      title: 'Components'
    ***REMOVED***,
    children: [
      ***REMOVED***
        path: 'buttons',
        component: ButtonsComponent,
        data: ***REMOVED***
          title: 'Buttons'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'cards',
        component: CardsComponent,
        data: ***REMOVED***
          title: 'Cards'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'forms',
        component: FormsComponent,
        data: ***REMOVED***
          title: 'Forms'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'modals',
        component: ModalsComponent,
        data: ***REMOVED***
          title: 'Modals'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'social-buttons',
        component: SocialButtonsComponent,
        data: ***REMOVED***
          title: 'Social buttons'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'switches',
        component: SwitchesComponent,
        data: ***REMOVED***
          title: 'Switches'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'tables',
        component: TablesComponent,
        data: ***REMOVED***
          title: 'Tables'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'tabs',
        component: TabsComponent,
        data: ***REMOVED***
          title: 'Tabs'
        ***REMOVED***
      ***REMOVED***
    ]
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class ComponentsRoutingModule ***REMOVED******REMOVED***
