import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

import ***REMOVED*** FontAwesomeComponent ***REMOVED*** from './font-awesome.component';
import ***REMOVED*** SimpleLineIconsComponent ***REMOVED*** from './simple-line-icons.component';

const routes: Routes = [
  ***REMOVED***
    path: '',
    data: ***REMOVED***
      title: 'Icons'
    ***REMOVED***,
    children: [
      ***REMOVED***
        path: 'font-awesome',
        component: FontAwesomeComponent,
        data: ***REMOVED***
          title: 'Font Awesome'
        ***REMOVED***
      ***REMOVED***,
      ***REMOVED***
        path: 'simple-line-icons',
        component: SimpleLineIconsComponent,
        data: ***REMOVED***
          title: 'Simple Line Icons'
        ***REMOVED***
      ***REMOVED***
    ]
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
***REMOVED***)
export class IconsRoutingModule ***REMOVED******REMOVED***
