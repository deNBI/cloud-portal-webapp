import {
  MinAmoutValidatorDirective,
  MaxAmoutValidatorDirective,
  IntegerValidatorDirective,
  IntegerOrNullValidatorDirective
} from '../../applications/numberValidations.directive';
import {NgModule} from '@angular/core';

/**
 * Shared directives module.
 */
@NgModule({
            imports: [],
            declarations: [
              MinAmoutValidatorDirective,
              MaxAmoutValidatorDirective,
              IntegerValidatorDirective,
              IntegerOrNullValidatorDirective
            ],
            exports: [
              MinAmoutValidatorDirective,
              MaxAmoutValidatorDirective,
              IntegerValidatorDirective,
              IntegerOrNullValidatorDirective
            ]
          })

export class SharedDirectivesModule {

}
