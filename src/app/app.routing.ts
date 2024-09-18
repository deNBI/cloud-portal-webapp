/* eslint-disable */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Layouts
import { ConsentInfoComponent } from './consent-info.component'
import { FullLayoutComponent } from './layouts/full-layout.component'
import { MemberGuardService } from './member-guard.service'
import { RegistrationInfoComponent } from './registration-info.component'
import { LoggedInGuard } from './logged-in-guard.service'
import { CreditsCalculatorComponent } from './credits-calculator/credits-calculator.component'
import { VoGuardService } from './shared/guards/vo-guard.service'

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'userinfo',
		pathMatch: 'full',
		data: {
			title: 'de.NBI Cloud Portal - Profile',
		},
	},
	{
		path: 'registration-info',
		component: RegistrationInfoComponent,
		pathMatch: 'full',
		data: {
			title: 'de.NBI Cloud Portal - Registration Info',
		},
	},
	{
		path: 'consent-info',
		component: ConsentInfoComponent,
		pathMatch: 'full',
		data: {
			title: 'de.NBI Cloud Portal - Consent Info',
		},
	},
	{
		path: '',
		component: FullLayoutComponent,
		canActivate: [MemberGuardService],
		data: {
			title: 'de.NBI Cloud Portal',
		},
		children: [
			{
				path: 'userinfo',
				canActivate: [LoggedInGuard],

				loadChildren: () => import('./userinfo/userinfo.module').then(m => m.UserinfoModule),
			},
			{
				path: 'help',
				canActivate: [LoggedInGuard],

				loadChildren: () => import('./help/help.module').then(m => m.HelpModule),
			},
			{
				path: 'project-management',
				canActivate: [LoggedInGuard],

				loadChildren: () => import('./projectmanagement/projectmanagement.module').then(m => m.ProjectManagementModule),
			},
			{
				path: 'applications',
				canActivate: [LoggedInGuard],

				loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule),
			},
			{
				path: 'vo-manager',
				loadChildren: () => import('./vo_manager/VoManager.module').then(m => m.VoManagerModule),
				canActivate: [VoGuardService],
			},
			{
				path: 'facility-manager',
				canActivate: [LoggedInGuard],

				loadChildren: () => import('./facility_manager/facilitymanager.module').then(m => m.FacilitymanagerModule),
			},
			{
				path: 'credits-calculator',
				canActivate: [LoggedInGuard],
				component: CreditsCalculatorComponent,

				loadChildren: () =>
					import('./credits-calculator/credits-calculator.module').then(m => m.CreditsCalculatorModule),
			},
		],
	},
]

/**
 * App routing module.
 */
@NgModule({
	imports: [RouterModule.forRoot(routes, {})],
	exports: [RouterModule],
	providers: [MemberGuardService, LoggedInGuard],
})
export class AppRoutingModule {}

/* eslint-enable */
