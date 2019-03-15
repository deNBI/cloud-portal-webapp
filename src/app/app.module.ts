import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {AppComponent} from './app.component';
import {NAV_DROPDOWN_DIRECTIVES} from './shared/nav-dropdown.directive';

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
import {FullLayoutComponent} from './layouts/full-layout.component';
import {RegistrationInfoComponent} from './registration-info.component';
import {AsideToggleDirective} from './shared/aside.directive';
import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {SIDEBAR_TOGGLE_DIRECTIVES} from './shared/sidebar.directive';
import {ApplicationBaseClass} from './shared/shared_modules/baseClass/application-base-class';

/**
 * App module.
 */
@NgModule({
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
        ExportAsModule,
        ApplicationBaseClass
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
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
