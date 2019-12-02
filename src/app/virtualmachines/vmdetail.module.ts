import {NgModule} from "@angular/core";
import {AccordionModule} from "ngx-bootstrap";
import {TabsModule} from "ngx-bootstrap/tabs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalModule} from "ngx-bootstrap/modal";
import {ApplicationsModule} from "../applications/applications.module";
import {SharedDirectivesModule} from "../shared/shared_modules/shared_directives.module";
import {VmDetailComponent} from "./vmdetail.component";

@NgModule({
  imports: [
    AccordionModule.forRoot(),
    TabsModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    ApplicationsModule,
    SharedDirectivesModule
  ],
  declarations: [
    VmDetailComponent
  ]
})

export class VmDetailModule {

}
