import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import {HasStatusPipe} from './pipes/has-status.pipe';
import { InListPipe } from './pipes/in-list.pipe';

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe],
              exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
