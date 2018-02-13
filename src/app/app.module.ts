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
import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {HttpModule} from '@angular/http';
import {AuthzResolver} from "./perun-connector/authz-resolver.service";
import {MembersManager} from "./perun-connector/members-manager.service";
import {PerunSettings} from "./perun-connector/connector-settings.service";
import {ApiSettings} from "./api-connector/api-settings.service";
// Routing Module
import {AppRoutingModule} from './app.routing';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {ModalModule} from "ngx-bootstrap";
import {RegistrationInfoComponent} from "./registration-info.component";

@NgModule({
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
    RegistrationInfoComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, MembersManager,
     AuthzResolver,
    PerunSettings,
    ApiSettings
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
