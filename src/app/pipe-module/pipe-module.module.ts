import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import {HasStatusPipe} from './pipes/has-status.pipe';

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe],
            exports: [FlavorCounterPipe, HasStatusPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
