import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ClipboardModule } from 'ngx-clipboard';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module } from 'angulartics2';
import { CookieService } from 'ngx-cookie-service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AppComponent } from './app.component';

import { ApiSettings } from './api-connector/api-settings.service';
import { UserService } from './api-connector/user.service';
import { AppInterceptor } from './app.interceptor.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
import { ConsentInfoComponent } from './consent-info.component';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { RegistrationInfoComponent } from './registration-info.component';
import { AsideToggleDirective } from './shared/aside.directive';
import { SharedModuleModule } from './shared/shared_modules/shared-module.module';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import {
	MobileSidebarToggleDirective,
	SidebarMinimizeDirective,
	SidebarOffCanvasCloseDirective,
	SidebarToggleDirective,
} from './shared/sidebar.directive';
import { UncaughtExceptionHandler } from './error-handler/UncaughtExceptionHandler.service';

import { TitleHeadbarComponent } from './shared/title-headbar.component';
import { VoService } from './api-connector/vo.service';
import { TokenInterceptor } from './api-connector/token-interceptor';
import { PipeModuleModule } from './pipe-module/pipe-module.module';
import { FacilityService } from './api-connector/facility.service';

/**
 * App module.
 */
@NgModule({
	imports: [
		NgScrollbarModule,
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		CommonModule,
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		NgChartsModule,
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
		SharedModuleModule,
		Angulartics2Module.forRoot(),
		NgSelectModule,
		BrowserAnimationsModule,
		ClipboardModule,
		PipeModuleModule,
		TimepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
		AlertModule,
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
		TitleHeadbarComponent,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AppInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true,
		},
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy,
		},
		{
			provide: ErrorHandler,
			useClass: UncaughtExceptionHandler,
		},
		ApiSettings,
		UserService,
		CookieService,
		VoService,
		FacilityService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
