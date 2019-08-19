import {Directive, forwardRef, Injectable, Input} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UniqueInstanceNameValidator implements AsyncValidator {
  constructor(private virtualmachineservice: VirtualmachineService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.virtualmachineservice.isInstanceNameTaken(ctrl.value).pipe(
      map((isTaken: any) => (isTaken ? { uniqueInstanceName: true } : null)),
      catchError(() => null)
    );
  }
}

@Directive({
             selector: '[appUniqueInstanceName]',
             providers: [
               {
                 provide: NG_ASYNC_VALIDATORS,
                 useExisting: forwardRef(() => UniqueInstanceNameValidator),
                 multi: true
               }
             ]
           })
export class UniqueInstanceNameDirective {
  @Input('appUniqueInstanceName') client: {[selector: string]: string};
  constructor(private validator: UniqueInstanceNameValidator) {}

  validate(control: AbstractControl): any {
    this.validator.validate(control);
  }
}
