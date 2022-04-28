import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlavorCounterPipe } from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import { InListPipe } from './pipes/in-list.pipe';
import { HasStatusPipe, StatusInListPipe } from './pipes/has-status.pipe';
import { IsPiApprovedPipe } from './pipes/is-pi-approved';
import { FloorIntegerPipe } from './pipes/floor-integer.pipe';
import { InAllowedPipe } from './pipes/in-allowed.pipe';

/**
 * Pipemodule
 */
@NgModule({
	declarations: [
		FlavorCounterPipe,
		HasStatusPipe,
		HasstatusinlistPipe,
		InListPipe,
		StatusInListPipe,
		IsPiApprovedPipe,
		FloorIntegerPipe,
		InAllowedPipe,
	],
	exports: [
		FlavorCounterPipe,
		HasStatusPipe,
		HasstatusinlistPipe,
		InListPipe,
		StatusInListPipe,
		IsPiApprovedPipe,
		FloorIntegerPipe,
		InAllowedPipe,
	],
	imports: [CommonModule],
})
export class PipeModuleModule {}
