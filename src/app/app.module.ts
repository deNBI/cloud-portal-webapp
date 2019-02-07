import ***REMOVED***BrowserModule***REMOVED*** from '@angular/platform-browser';
import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***LocationStrategy, HashLocationStrategy***REMOVED*** from '@angular/common';

import ***REMOVED***AppComponent***REMOVED*** from './app.component';
import ***REMOVED***BsDropdownModule***REMOVED*** from 'ngx-bootstrap/dropdown';
import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***NAV_DROPDOWN_DIRECTIVES***REMOVED*** from './shared/nav-dropdown.directive';

import ***REMOVED***ChartsModule***REMOVED*** from 'ng2-charts/ng2-charts';
import ***REMOVED***SIDEBAR_TOGGLE_DIRECTIVES***REMOVED*** from './shared/sidebar.directive';
import ***REMOVED***AsideToggleDirective***REMOVED*** from './shared/aside.directive';
import ***REMOVED***PopoverModule***REMOVED*** from 'ngx-popover';
import ***REMOVED***BreadcrumbsComponent***REMOVED*** from './shared/breadcrumb.component';
import ***REMOVED***PerunSettings***REMOVED*** from "./perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "./api-connector/api-settings.service";
import ***REMOVED***HttpClientModule***REMOVED*** from '@angular/common/http';
// Routing Module
import ***REMOVED***AppRoutingModule***REMOVED*** from './app.routing';
import ***REMOVED***PaginationModule***REMOVED*** from 'ngx-bootstrap/pagination';
import ***REMOVED***ExportAsModule***REMOVED*** from 'ngx-export-as';

// Layouts
import ***REMOVED***FullLayoutComponent***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED***SimpleLayoutComponent***REMOVED*** from './layouts/simple-layout.component';
import ***REMOVED***ModalModule***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***RegistrationInfoComponent***REMOVED*** from "./registration-info.component";
import ***REMOVED***UserService***REMOVED*** from "./api-connector/user.service";
import ***REMOVED***ConsentInfoComponent***REMOVED*** from "./consent-info.component";

@NgModule(***REMOVED***
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        ModalModule.forRoot(),
        PopoverModule,
        PaginationModule.forRoot(),
        ExportAsModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SimpleLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        RegistrationInfoComponent,
        ConsentInfoComponent,
    ],
    providers: [***REMOVED***
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    ***REMOVED***,

        PerunSettings,
        ApiSettings,
        UserService
    ],
    bootstrap: [AppComponent]
***REMOVED***)
export class AppModule ***REMOVED***
***REMOVED***
