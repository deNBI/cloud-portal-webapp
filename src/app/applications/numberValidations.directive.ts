import ***REMOVED*** Directive, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl ***REMOVED*** from '@angular/forms';

@Directive(***REMOVED***
  selector: '[appMinAmount]',
  providers: [
    ***REMOVED*** provide: NG_VALIDATORS, useExisting: MinAmoutValidatorDirective, multi: true ***REMOVED***
  ]
***REMOVED***)
export class MinAmoutValidatorDirective implements Validator ***REMOVED***
  @Input('appMinAmount') minAmount: number;

  validate(control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null ***REMOVED***
    return this.minAmount ? minAmountValidator(this.minAmount)(control) : null;
  ***REMOVED***
***REMOVED***

export function minAmountValidator(val: number): ValidatorFn ***REMOVED***
  return (control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null => ***REMOVED***
    const less: any = control.value < val;

    return less ? ***REMOVED***'minVal': ***REMOVED***value: control.value***REMOVED******REMOVED*** : null;
  ***REMOVED***;
***REMOVED***

@Directive(***REMOVED***
  selector: '[appMaxAmount]',
  providers: [
    ***REMOVED*** provide: NG_VALIDATORS, useExisting: MaxAmoutValidatorDirective, multi: true ***REMOVED***
  ]
***REMOVED***)
export class MaxAmoutValidatorDirective implements Validator ***REMOVED***
  @Input('appMaxAmount') maxAmount: number;

  validate(control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null ***REMOVED***
    return this.maxAmount ? maxAmountValidator(this.maxAmount)(control) : null;
  ***REMOVED***
***REMOVED***

export function maxAmountValidator(val: number): ValidatorFn ***REMOVED***
  return (control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null => ***REMOVED***
    const more: any = control.value > val;

    return more ? ***REMOVED***'maxVal': ***REMOVED***value: control.value***REMOVED******REMOVED*** : null;
  ***REMOVED***;
***REMOVED***

@Directive(***REMOVED***
  selector: '[appInteger]',
  providers: [
    ***REMOVED*** provide: NG_VALIDATORS, useExisting: IntegerValidatorDirective, multi: true ***REMOVED***
  ]
***REMOVED***)
export class IntegerValidatorDirective implements Validator ***REMOVED***
  validate(control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null ***REMOVED***
    return integerValidator()(control);
  ***REMOVED***
***REMOVED***

export function integerValidator(): ValidatorFn ***REMOVED***
  return (control: AbstractControl): ***REMOVED***[key: string]: any***REMOVED*** | null => ***REMOVED***
    const integer: any = Number.isInteger(control.value);

    return integer ? null : ***REMOVED***'integer': ***REMOVED***value: control.value***REMOVED******REMOVED***;
  ***REMOVED***;
***REMOVED***
