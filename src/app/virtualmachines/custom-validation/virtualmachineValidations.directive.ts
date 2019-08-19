import {Directive, Input} from '@angular/core';
import {AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';
import {catchError, map} from 'rxjs/operators';

export function existingInstanceNameValidator(virtualmachineservice: VirtualmachineService,
                                              client: {[key: string]: string}):
  AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return virtualmachineservice.isInstanceNameTaken(control.value, client['host'], client['port']).pipe(
      map((isTaken: any) => (isTaken === 'true' ? { uniqueInstanceName: true } : null)),
      catchError(() => null)
    );
  };
}

@Directive({
             selector: '[appInstanceNameUnique]',
             providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ExistingUsernameValidatorDirective, multi: true}]
           })
export class ExistingUsernameValidatorDirective implements AsyncValidator {
  @Input('appInstanceNameUnique') client: {[key: string]: string};
  constructor(private virtualmachineservice: VirtualmachineService) {}

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return existingInstanceNameValidator(this.virtualmachineservice, this.client)(control);
  }
}
