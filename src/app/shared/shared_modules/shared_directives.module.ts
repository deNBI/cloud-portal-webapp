import { NgModule } from '@angular/core';
import {
	FloatOrNullValidatorDirective,
	FloatValidatorDirective,
	IntegerOrNullValidatorDirective,
	IntegerValidatorDirective,
	MaxAmoutValidatorDirective,
	MinAmoutValidatorDirective,
} from '../../applications/numberValidations.directive';
import {NgbdSortableHeader} from './directives/nbd-sortable-header.directive';

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
				NgbdSortableHeader,
		],
		exports: [
				MinAmoutValidatorDirective,
				MaxAmoutValidatorDirective,
				IntegerValidatorDirective,
				IntegerOrNullValidatorDirective,
				FloatOrNullValidatorDirective,
				FloatValidatorDirective,
				NgbdSortableHeader,
		],
})

export class SharedDirectivesModule {

}
