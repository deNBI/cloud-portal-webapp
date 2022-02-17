import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecoiUploadComponent } from './decoi-upload/decoi-upload.component';

const routes: Routes = [
	{
		path: '',
		component: DecoiUploadComponent,
		data: {
			title: 'DeCoi Upload File',
		},

	},
];

/**
 * Routing module for decoi
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DecoiRoutingModule { }
