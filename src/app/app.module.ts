import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {ModalModule} from 'ngx-bootstrap';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {ExportAsModule} from 'ngx-export-as';
import {PopoverModule} from 'ngx-popover';
import {ApiSettings} from './api-connector/api-settings.service';
import {UserService} from './api-connector/user.service';
// Routing Module
import {AppRoutingModule} from './app.routing';
import {ConsentInfoComponent} from './consent-info.component';
// Layouts
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import {FullLayoutComponent} from './layouts/full-layout.component';
import {RegistrationInfoComponent} from './registration-info.component';
import {AsideToggleDirective} from './shared/aside.directive';
import {ApplicationBaseClass} from "./shared/shared_modules/baseClass/application-base-class";
import {SharedModuleModule} from "./shared/shared_modules/shared-module.module";
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';


/**
 * App module.
 */
@NgModule({
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
        ConsentInfoComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    },

        ApiSettings,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
