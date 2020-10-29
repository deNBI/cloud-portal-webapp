import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlavorCounterPipe} from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import { InListPipe } from './pipes/in-list.pipe';
import {HasStatusPipe, StatusInProcessPipe} from './pipes/has-status.pipe';


/**
 * Pipemodule
 */
@NgModule({
            declarations: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe,StatusInProcessPipe],
              exports: [FlavorCounterPipe, HasStatusPipe, HasstatusinlistPipe, InListPipe,StatusInProcessPipe],
            imports: [
              CommonModule
            ]
          })
export class PipeModuleModule {
}
