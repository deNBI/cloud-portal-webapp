import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import {HasStatusPipe} from './pipes/has-status.pipe';
import {GraphIsGroupedPipe} from "./pipes/GraphIsGroupedPipe";

/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, GraphIsGroupedPipe],
            exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, GraphIsGroupedPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
