import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import {HasStatusPipe} from './pipes/has-status.pipe';

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe],
            exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
