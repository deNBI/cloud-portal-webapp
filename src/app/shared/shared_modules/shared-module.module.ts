import {NgModule} from '@angular/core';
import {AbstractBaseClasse} from "./baseClass/abstract-base-class";
import {ApplicationBaseClass} from "./baseClass/application-base-class";
import {FilterBaseClass} from "./baseClass/filter-base-class";


@NgModule({
    exports: [
        ApplicationBaseClass,
        FilterBaseClass,
    ]
})
class SharedModule {
}
