import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HelpComponent} from '../help/help.component';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    data: {
      title: 'Help'
    }

  }
];

/**
 * Help module.
 */
@NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
          })
export class HelpRoutingModule {
}
