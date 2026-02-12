import { enableProdMode, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'

import { environment } from './environments/environment'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { AppInterceptor } from './app/app.interceptor.component'
import { TokenInterceptor } from './app/api-connector/token-interceptor'
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common'
import { UncaughtExceptionHandler } from './app/error-handler/UncaughtExceptionHandler.service'
import { ApiSettings } from './app/api-connector/api-settings.service'
import { UserService } from './app/api-connector/user.service'
import { CookieService } from 'ngx-cookie-service'
import { VoService } from './app/api-connector/vo.service'
import { FacilityService } from './app/api-connector/facility.service'
import { Title, BrowserModule, bootstrapApplication } from '@angular/platform-browser'
import { TitleService } from './app/title.service'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { AppRoutingModule } from './app/app.routing'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { ModalModule } from 'ngx-bootstrap/modal'
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { SharedModuleModule } from './app/shared/shared_modules/shared-module.module'
import { Angulartics2Module } from 'angulartics2'
import { NgSelectModule } from '@ng-select/ng-select'
import { provideAnimations } from '@angular/platform-browser/animations'
import { ClipboardModule } from 'ngx-clipboard'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AlertModule } from 'ngx-bootstrap/alert'
import { MatomoModule, MatomoRouterModule } from 'ngx-matomo-client'
import { AppComponent } from './app/app.component'

if (environment.production) {
	enableProdMode()
}
/* eslint-disable */

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		importProvidersFrom(
			NgScrollbarModule,
			BrowserModule,
			AppRoutingModule,
			CommonModule,
			BsDropdownModule.forRoot(),
			TabsModule.forRoot(),
			ModalModule.forRoot(),
			PaginationModule.forRoot(),
			SharedModuleModule,
			Angulartics2Module.forRoot(),
			NgSelectModule,
			ClipboardModule,
			TimepickerModule.forRoot(),
			BsDatepickerModule.forRoot(),
			AlertModule,
			MatomoModule.forRoot({
				siteId: environment.MATOMO_SITE_ID,
				trackerUrl: environment.MATOMO_TRACKING_URL,
			}),
			MatomoRouterModule
		),
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
		Title,
		TitleService,
		provideHttpClient(withInterceptorsFromDi()),
		provideAnimations(),
	],
}).then(() => {
	if (navigator.serviceWorker && environment.production) {
		navigator.serviceWorker.getRegistrations().then(function (registrations) {
			for (const registration of registrations) {
				registration.unregister()
			}
		})
	}
})

/* eslint-enable */
