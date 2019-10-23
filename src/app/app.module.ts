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
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {FullLayoutComponent} from './layouts/full-layout.component';
import {RegistrationInfoComponent} from './registration-info.component';
import {AsideToggleDirective} from './shared/aside.directive';
import {SharedModuleModule} from './shared/shared_modules/shared-module.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {
    MobileSidebarToggleDirective,
    SidebarMinimizeDirective,
    SidebarOffCanvasCloseDirective,
    SidebarToggleDirective
} from './shared/sidebar.directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Angulartics2Module} from 'angulartics2';
import { ErrorHandler } from '@angular/core';
import {UncaughtExceptionHandler} from './error-handler/UncaughtExceptionHandler.service';
import {CookieService} from 'ngx-cookie-service';

import {TitleHeadbarComponent} from './shared/title-headbar.component';

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
        SharedModuleModule,
        Angulartics2Module.forRoot(),
        BrowserAnimationsModule
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
        SidebarOffCanvasCloseDirective,
        TitleHeadbarComponent
    ],
    providers: [
      {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
      },
      {
        provide: ErrorHandler,
        useClass: UncaughtExceptionHandler
      },
        ApiSettings,
        UserService,
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
