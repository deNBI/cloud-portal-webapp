import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoComponent } from './userinfo.component';

const routes: Routes = [
	{
		path: '',
		component: UserInfoComponent,
		data: {
			title: 'Profile',
		},

	},
];

/**
 * Userinfo routing module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserInfoRoutingModule {
}
