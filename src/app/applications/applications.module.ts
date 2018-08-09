import {NgModule} from '@angular/core';

import {TabsModule} from 'ngx-bootstrap/tabs';
import {ApplicationsComponent} from './applications.component';
import {ApplicationsRoutingModule} from './applications-routing.module';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AddsinglevmComponent} from "./addsinglevm.component";
import {AddcloudapplicationComponent} from "./addcloudapplication.component";

@NgModule({
    imports: [
        ApplicationsRoutingModule,
        TabsModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),


    ],
    declarations: [
        ApplicationsComponent,
        AddsinglevmComponent,
        AddcloudapplicationComponent,
    ]
})
export class ApplicationsModule {
}
