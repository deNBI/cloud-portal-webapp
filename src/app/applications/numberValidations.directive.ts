import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[appMinAmount]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinAmoutValidatorDirective, multi: true }
  ]
})
export class MinAmoutValidatorDirective implements Validator {
  @Input('appMinAmount') minAmount: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.minAmount ? minAmountValidator(this.minAmount)(control) : null;
  }
}

export function minAmountValidator(val: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const less: any = control.value < val;

    return less ? {'minVal': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appMaxAmount]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxAmoutValidatorDirective, multi: true }
  ]
})
export class MaxAmoutValidatorDirective implements Validator {
  @Input('appMaxAmount') maxAmount: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.maxAmount ? maxAmountValidator(this.maxAmount)(control) : null;
  }
}

export function maxAmountValidator(val: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const more: any = control.value > val;

    return more ? {'maxVal': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appInteger]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: IntegerValidatorDirective, multi: true }
  ]
})
export class IntegerValidatorDirective implements Validator {
  validate(control: AbstractControl): {[key: string]: any} | null {
    return integerValidator()(control);
  }
}

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const integer: any = Number.isInteger(control.value);

    return integer ? null : {'integer': {value: control.value}};
  };
}
