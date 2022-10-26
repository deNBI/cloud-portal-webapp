import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlavorCounterPipe } from './pipes/flavorcounter';
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe';
import { InListPipe } from './pipes/in-list.pipe';
import { HasStatusPipe, StatusInListPipe } from './pipes/has-status.pipe';
import { IsPiApprovedPipe } from './pipes/is-pi-approved';
import { FloorIntegerPipe } from './pipes/floor-integer.pipe';
import { InAllowedPipe } from './pipes/in-allowed.pipe';
import { NoCoresPipe, NoRamPipe, NoVMsPipe } from './pipes/ressources';
import { HasUnavailableFlavorsPipe } from './pipes/has-unavailable-flavors.pipe';

/**
 * Pipemodule
 */
@NgModule({
	declarations: [
		FlavorCounterPipe,
		HasStatusPipe,
		HasstatusinlistPipe,
		HasUnavailableFlavorsPipe,
		InListPipe,
		StatusInListPipe,
		IsPiApprovedPipe,
		FloorIntegerPipe,
		InAllowedPipe,
		NoVMsPipe,
		NoCoresPipe,
		NoRamPipe,
	],
	exports: [
		FlavorCounterPipe,
		HasStatusPipe,
		HasstatusinlistPipe,
		HasUnavailableFlavorsPipe,
		InListPipe,
		StatusInListPipe,
		IsPiApprovedPipe,
		FloorIntegerPipe,
		InAllowedPipe,
		NoVMsPipe,
		NoCoresPipe,
		NoRamPipe,
	],
	imports: [CommonModule],
})
export class PipeModuleModule {}
