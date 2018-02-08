import ***REMOVED*** BrowserModule ***REMOVED*** from '@angular/platform-browser';
import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** LocationStrategy, HashLocationStrategy ***REMOVED*** from '@angular/common';

import ***REMOVED*** AppComponent ***REMOVED*** from './app.component';
import ***REMOVED*** BsDropdownModule ***REMOVED*** from 'ngx-bootstrap/dropdown';
import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** NAV_DROPDOWN_DIRECTIVES ***REMOVED*** from './shared/nav-dropdown.directive';

import ***REMOVED*** ChartsModule ***REMOVED*** from 'ng2-charts/ng2-charts';
import ***REMOVED*** SIDEBAR_TOGGLE_DIRECTIVES ***REMOVED*** from './shared/sidebar.directive';
import ***REMOVED*** AsideToggleDirective ***REMOVED*** from './shared/aside.directive';
import ***REMOVED*** BreadcrumbsComponent ***REMOVED*** from './shared/breadcrumb.component';

import ***REMOVED*** HttpModule ***REMOVED*** from '@angular/http';

// Routing Module
import ***REMOVED*** AppRoutingModule ***REMOVED*** from './app.routing';

// Layouts
import ***REMOVED*** FullLayoutComponent ***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED*** SimpleLayoutComponent ***REMOVED*** from './layouts/simple-layout.component';
import ***REMOVED***ModalModule***REMOVED*** from "ngx-bootstrap";

@NgModule(***REMOVED***
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
  ],
  providers: [***REMOVED***
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  ***REMOVED***],
  bootstrap: [ AppComponent ]
***REMOVED***)
export class AppModule ***REMOVED*** ***REMOVED***
