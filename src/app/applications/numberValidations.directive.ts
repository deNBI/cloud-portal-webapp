// eslint-disable-next-line max-classes-per-file
import { Directive, Input } from '@angular/core';
import {
	AbstractControl, NG_VALIDATORS, Validator, ValidatorFn,
} from '@angular/forms';

/**
 * Number validation directive.
 */
@Directive({
	selector: '[appMinAmount]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: MinAmoutValidatorDirective, multi: true },
	],
})
export class MinAmoutValidatorDirective implements Validator {
	@Input('appMinAmount') minAmount: number;

	validate(control: AbstractControl): { [key: string]: any } | null {
		return this.minAmount ? minAmountValidator(this.minAmount)(control) : null;
	}
}

/**
 * Returns a validatorFn which checks if the value to control is less the comparison
 * @param val the value to check
 */
export function minAmountValidator(val: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const less: boolean = control.value < val;

		return less ? { minVal: { value: control.value } } : null;
	};
}

/**
 * Max amount directive.
 */
@Directive({
	selector: '[appMaxAmount]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: MaxAmoutValidatorDirective, multi: true },
	],
})
export class MaxAmoutValidatorDirective implements Validator {
	@Input('appMaxAmount') maxAmount: number;

	validate(control: AbstractControl): { [key: string]: any } | null {
		return this.maxAmount ? maxAmountValidator(this.maxAmount)(control) : null;
	}
}

/**
 * Returns a validatorFn which checks if the value to control is more the comparison
 * @param val the value to check
 */
export function maxAmountValidator(val: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const more: boolean = control.value > val;

		return more ? { maxVal: { value: control.value } } : null;
	};
}

/**
 * Integer directive.
 */
@Directive({
	selector: '[appInteger]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: IntegerValidatorDirective, multi: true },
	],
})
export class IntegerValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		return integerValidator()(control);
	}
}

/**
 * Returns a validator for integers
 */
export function integerValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const integer: boolean = Number.isInteger(control.value);

		return integer ? null : { integer: { value: control.value } };
	};
}

/**
 * Returns a validator for floats
 */
export function floatValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const float: boolean = Number.isInteger(control.value) || (Number(control.value) === control.value && control.value % 1 !== 0);

		return float ? null : { float: { value: control.value } };
	};
}

/**
 * Returns a validator for floats or null values
 */
export function floatOrNullValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const float: boolean = ((Number.isInteger(control.value) || Number(control.value) === control.value)
			&& control.value % 1 !== 0) || !control.value;

		return float ? null : { floatOrNulL: { value: control.value } };
	};
}

/**
 * Float directive.
 */
@Directive({
	selector: '[appFloat]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: FloatValidatorDirective, multi: true },
	],
})
export class FloatValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		return floatValidator()(control);
	}
}

/**
 * Integer or Null directive.
 */
@Directive({
	selector: '[appFloatOrNull]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: FloatOrNullValidatorDirective, multi: true },
	],
})
export class FloatOrNullValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		return floatOrNullValidator()(control);
	}
}

/**
 * Integer or Null directive.
 */
@Directive({
	selector: '[appIntegerOrNull]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: IntegerOrNullValidatorDirective, multi: true },
	],
})
export class IntegerOrNullValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		return integerOrNullValidator()(control);
	}
}

/**
 * Returns a validator for integers or null values
 */
export function integerOrNullValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const integer: boolean = (Number.isInteger(control.value) || !control.value);

		return integer ? null : { integerOrNull: { value: control.value } };
	};
}
