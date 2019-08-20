import ***REMOVED***Directive, Input***REMOVED*** from '@angular/core';
import ***REMOVED***AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors***REMOVED*** from '@angular/forms';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***VirtualmachineService***REMOVED*** from '../../api-connector/virtualmachine.service';
import ***REMOVED***catchError, map***REMOVED*** from 'rxjs/operators';

export function existingInstanceNameValidator(virtualmachineservice: VirtualmachineService,
                                              client: ***REMOVED***[key: string]: string***REMOVED***):
  AsyncValidatorFn ***REMOVED***
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => ***REMOVED***
    return virtualmachineservice.isInstanceNameTaken(control.value, client['host'], client['port']).pipe(
      map((isTaken: any) => (isTaken === 'true' ? ***REMOVED*** uniqueInstanceName: true ***REMOVED*** : null)),
      catchError(() => null)
    );
  ***REMOVED***;
***REMOVED***

@Directive(***REMOVED***
             selector: '[appInstanceNameUnique]',
             providers: [***REMOVED***provide: NG_ASYNC_VALIDATORS, useExisting: ExistingUsernameValidatorDirective, multi: true***REMOVED***]
           ***REMOVED***)
export class ExistingUsernameValidatorDirective implements AsyncValidator ***REMOVED***
  @Input('appInstanceNameUnique') client: ***REMOVED***[key: string]: string***REMOVED***;
  constructor(private virtualmachineservice: VirtualmachineService) ***REMOVED******REMOVED***

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> ***REMOVED***
    return existingInstanceNameValidator(this.virtualmachineservice, this.client)(control);
  ***REMOVED***
***REMOVED***
