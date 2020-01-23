import {NgModule} from "@angular/core";
import {AccordionModule} from "ngx-bootstrap";
import {TabsModule} from "ngx-bootstrap/tabs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalModule} from "ngx-bootstrap/modal";
import {SharedDirectivesModule} from "../shared/shared_modules/shared_directives.module";
import {VmDetailRoutingModule} from "./vmdetail-routing.module";
import {VmOverviewComponent} from "./vmOverview.component";

@NgModule({
  imports: [
    AccordionModule.forRoot(),
    VmDetailRoutingModule,
    TabsModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    SharedDirectivesModule
  ],
  declarations: [
  ]
})

export class VmDetailModule {

}
