import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import {HasStatusPipe, StatusInProcessPipe} from './pipes/has-status.pipe';

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, StatusInProcessPipe],
            exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, StatusInProcessPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
