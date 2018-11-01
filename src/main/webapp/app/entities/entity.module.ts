import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ClinicJhipsterPatientModule } from './patient/patient.module';
import { ClinicJhipsterHealthChartModule } from './health-chart/health-chart.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        ClinicJhipsterPatientModule,
        ClinicJhipsterHealthChartModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicJhipsterEntityModule {}
