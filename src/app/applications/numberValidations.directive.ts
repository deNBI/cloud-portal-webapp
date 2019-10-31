import {Directive, Input} from '@angular/core';
import {NG_VALIDATORS, AbstractControl, ValidatorFn, Validator} from '@angular/forms';

/**
 * Number validation directive.
 */
@Directive({
             selector: '[appMinAmount]',
             providers: [
               {provide: NG_VALIDATORS, useExisting: MinAmoutValidatorDirective, multi: true}
             ]
           })
export class MinAmoutValidatorDirective implements Validator {
  @Input('appMinAmount') minAmount: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.minAmount ? minAmountValidator(this.minAmount)(control) : null;
  }
}

export function minAmountValidator(val: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const less: boolean = control.value < val;

    return less ? {minVal: {value: control.value}} : null;
  };
}

/**
 * Max amount directive.
 */
@Directive({
             selector: '[appMaxAmount]',
             providers: [
               {provide: NG_VALIDATORS, useExisting: MaxAmoutValidatorDirective, multi: true}
             ]
           })
export class MaxAmoutValidatorDirective implements Validator {
  @Input('appMaxAmount') maxAmount: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.maxAmount ? maxAmountValidator(this.maxAmount)(control) : null;
  }
}

export function maxAmountValidator(val: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const more: boolean = control.value > val;

    return more ? {maxVal: {value: control.value}} : null;
  };
}

/**
 * Integer directive.
 */
@Directive({
             selector: '[appInteger]',
             providers: [
               {provide: NG_VALIDATORS, useExisting: IntegerValidatorDirective, multi: true}
             ]
           })
export class IntegerValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return integerValidator()(control);
  }
}

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const integer: boolean = Number.isInteger(control.value);

    return integer ? null : {integer: {value: control.value}};
  };
}

/**
 * Integer or Null directive.
 */
@Directive({
             selector: '[appIntegerOrNull]',
             providers: [
               {provide: NG_VALIDATORS, useExisting: IntegerOrNullValidatorDirective, multi: true}
             ]
           })
export class IntegerOrNullValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return integerOrNullValidator()(control);
  }
}

export function integerOrNullValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const integer: boolean = (Number.isInteger(control.value) || !control.value);

    return integer ? null : {integerOrNull: {value: control.value}};
  };
}
