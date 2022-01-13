import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { FaqComponent } from './faq.component';

const routes: Routes = [
	{
		path: '',
		component: HelpComponent,
		data: {
			title: 'Help',
		},

	},
	{
		path: 'faq',
		component: FaqComponent,
		data: {
			title: 'FAQ',
		},
	},
];

/**
 * Help module.
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HelpRoutingModule {
}
