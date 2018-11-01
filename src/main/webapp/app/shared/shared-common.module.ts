import { NgModule } from '@angular/core';

import { ClinicJhipsterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [ClinicJhipsterSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [ClinicJhipsterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class ClinicJhipsterSharedCommonModule {}
