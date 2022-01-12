import { NgModule } from '@angular/core';
import {
	FloatOrNullValidatorDirective,
	FloatValidatorDirective,
	IntegerOrNullValidatorDirective,
	IntegerValidatorDirective,
	MaxAmoutValidatorDirective,
	MinAmoutValidatorDirective,
} from '../../applications/numberValidations.directive';

/**
 * Shared directives module.
 */
@NgModule({
	imports: [],
	declarations: [
		MinAmoutValidatorDirective,
		MaxAmoutValidatorDirective,
		IntegerValidatorDirective,
		IntegerOrNullValidatorDirective,
		FloatOrNullValidatorDirective,
		FloatValidatorDirective,
	],
	exports: [
		MinAmoutValidatorDirective,
		MaxAmoutValidatorDirective,
		IntegerValidatorDirective,
		IntegerOrNullValidatorDirective,
		FloatOrNullValidatorDirective,
		FloatValidatorDirective,
	],
})

export class SharedDirectivesModule {

}
