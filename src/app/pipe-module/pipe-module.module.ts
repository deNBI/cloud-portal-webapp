import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FlavorCounterPipe } from './pipes/flavorcounter'
import { HasstatusinlistPipe } from './pipes/hasstatusinlist.pipe'
import { InListPipe } from './pipes/in-list.pipe'
import { HasStatusPipe, StatusInListPipe } from './pipes/has-status.pipe'
import { IsPiApprovedPipe } from './pipes/is-pi-approved'
import { FloorIntegerPipe } from './pipes/floor-integer.pipe'
import { InAllowedPipe } from './pipes/in-allowed.pipe'
import { NoCoresPipe, NoRamPipe, NoVMsPipe } from './pipes/ressources'
import { HasUnavailableFlavorsPipe } from './pipes/has-unavailable-flavors.pipe'
import { ValidTimeFramePipe } from './pipes/validTimeFrame.pipe'
import { PublicKeyPipe } from './pipes/publicKey.pipe'
import { IsFutureTimePipe } from './pipes/futureTime.pipe'
import { IsMigratedProjectIdPipe } from './pipes/migratedList'
import { HasStatusNotInListPipe } from './pipes/has-status-not-in-list.pipe'
import { SignificancePipe } from '../shared/shared_modules/components/maintenance-notification/significance-pipe/significance.pipe'
import { SocialConsentGivenPipe } from './pipes/social-consent-given.pipe'
import { IsMigratedProjectPipe } from './pipes/isMigratedProject'
import { HasFlavorTypeOrIsNotCustomPipe } from './pipes/has-flavor-type.pipe'
import {
	NewsValidationPipe,
	NewsMOTDValidationPipe,
	NewsTextValidationPipe,
	NewsTitleValidationPipe
} from './pipes/news-valid.pipe'

/**
 * Pipemodule
 */
@NgModule({
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
        ValidTimeFramePipe,
        IsFutureTimePipe,
        PublicKeyPipe,
        IsMigratedProjectIdPipe,
        HasStatusNotInListPipe,
        SignificancePipe,
        SocialConsentGivenPipe,
        IsMigratedProjectPipe,
        HasFlavorTypeOrIsNotCustomPipe,
        NewsValidationPipe,
        NewsMOTDValidationPipe,
        NewsTextValidationPipe,
        NewsTitleValidationPipe
    ],
    imports: [CommonModule, FlavorCounterPipe,
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
        ValidTimeFramePipe,
        IsFutureTimePipe,
        PublicKeyPipe,
        IsMigratedProjectIdPipe,
        HasStatusNotInListPipe,
        SignificancePipe,
        SocialConsentGivenPipe,
        IsMigratedProjectPipe,
        HasFlavorTypeOrIsNotCustomPipe,
        NewsValidationPipe,
        NewsMOTDValidationPipe,
        NewsTextValidationPipe,
        NewsTitleValidationPipe],
    providers: []
})
export class PipeModuleModule {}
