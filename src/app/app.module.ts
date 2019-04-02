import ***REMOVED***HashLocationStrategy, LocationStrategy***REMOVED*** from '@angular/common';
import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***BrowserModule***REMOVED*** from '@angular/platform-browser';

import ***REMOVED***BsDropdownModule***REMOVED*** from 'ngx-bootstrap/dropdown';
import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***AppComponent***REMOVED*** from './app.component';

import ***REMOVED***HttpClientModule***REMOVED*** from '@angular/common/http';
import ***REMOVED***ChartsModule***REMOVED*** from 'ng2-charts/ng2-charts';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***PaginationModule***REMOVED*** from 'ngx-bootstrap/pagination';
import ***REMOVED***ExportAsModule***REMOVED*** from 'ngx-export-as';
import ***REMOVED***PopoverModule***REMOVED*** from 'ngx-popover';
import ***REMOVED***ApiSettings***REMOVED*** from './api-connector/api-settings.service';
import ***REMOVED***UserService***REMOVED*** from './api-connector/user.service';
// Routing Module
import ***REMOVED***AppRoutingModule***REMOVED*** from './app.routing';
import ***REMOVED***ConsentInfoComponent***REMOVED*** from './consent-info.component';
// Layouts
import ***REMOVED***
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
***REMOVED*** from '@coreui/angular';
import ***REMOVED***FullLayoutComponent***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED***RegistrationInfoComponent***REMOVED*** from './registration-info.component';
import ***REMOVED***AsideToggleDirective***REMOVED*** from './shared/aside.directive';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from "./shared/shared_modules/baseClass/application-base-class";
import ***REMOVED***SharedModuleModule***REMOVED*** from "./shared/shared_modules/shared-module.module";
import ***REMOVED***PerfectScrollbarModule***REMOVED*** from 'ngx-perfect-scrollbar';
import ***REMOVED***BreadcrumbsComponent***REMOVED*** from "./shared/breadcrumb.component";
import ***REMOVED***
    MobileSidebarToggleDirective, SidebarMinimizeDirective, SidebarOffCanvasCloseDirective,
    SidebarToggleDirective
***REMOVED*** from "./shared/sidebar.directive";


/**
 * App module.
 */
@NgModule(***REMOVED***
    imports: [
        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppHeaderModule,
        AppFooterModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        ModalModule.forRoot(),
        PopoverModule,
        PaginationModule.forRoot(),
        ExportAsModule,
        SharedModuleModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        AsideToggleDirective,
        RegistrationInfoComponent,
        ConsentInfoComponent,
        BreadcrumbsComponent,
        SidebarToggleDirective,
        SidebarMinimizeDirective,
        MobileSidebarToggleDirective,
        SidebarOffCanvasCloseDirective


    ],
    providers: [***REMOVED***
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    ***REMOVED***,

        ApiSettings,
        UserService
    ],
    bootstrap: [AppComponent]
***REMOVED***)
export class AppModule ***REMOVED***
***REMOVED***
