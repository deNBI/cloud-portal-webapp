import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {AppComponent} from './app.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NAV_DROPDOWN_DIRECTIVES} from './shared/nav-dropdown.directive';

import {ChartsModule} from 'ng2-charts/ng2-charts';
import {SIDEBAR_TOGGLE_DIRECTIVES} from './shared/sidebar.directive';
import {AsideToggleDirective} from './shared/aside.directive';
import {PopoverModule} from 'ngx-popover';
import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {PerunSettings} from './perun-connector/connector-settings.service';
import {ApiSettings} from './api-connector/api-settings.service';
import {HttpClientModule} from '@angular/common/http';
// Routing Module
import {AppRoutingModule} from './app.routing';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {ExportAsModule} from 'ngx-export-as';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {ModalModule} from 'ngx-bootstrap';
import {RegistrationInfoComponent} from './registration-info.component';
import {UserService} from './api-connector/user.service';
import {ConsentInfoComponent} from './consent-info.component';

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
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    },

        PerunSettings,
        ApiSettings,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
