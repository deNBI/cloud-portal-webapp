import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import {HasstatusinlistPipe} from './pipes/hasstatusinlist.pipe';
import {InListPipe} from './pipes/in-list.pipe';
import {HasStatusPipe, StatusInProcessPipe} from './pipes/has-status.pipe';
import {IsPiApprovedPipe} from './pipes/is-pi-approved';

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe, StatusInProcessPipe, IsPiApprovedPipe],
            exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe, StatusInProcessPipe, IsPiApprovedPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
