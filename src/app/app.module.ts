import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ClipboardModule } from 'ngx-clipboard';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module } from 'angulartics2';
import { CookieService } from 'ngx-cookie-service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
		ChartsModule,
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
		SharedModuleModule,
		Angulartics2Module.forRoot(),
		BrowserAnimationsModule,
		ClipboardModule,
		PipeModuleModule,
		TimepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
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
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
