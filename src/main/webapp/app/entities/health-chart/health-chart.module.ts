import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClinicJhipsterSharedModule } from 'app/shared';
import {
    HealthChartComponent,
    HealthChartDetailComponent,
    HealthChartUpdateComponent,
    HealthChartDeletePopupComponent,
    HealthChartDeleteDialogComponent,
    healthChartRoute,
    healthChartPopupRoute
} from './';

const ENTITY_STATES = [...healthChartRoute, ...healthChartPopupRoute];

@NgModule({
    imports: [ClinicJhipsterSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        HealthChartComponent,
        HealthChartDetailComponent,
        HealthChartUpdateComponent,
        HealthChartDeleteDialogComponent,
        HealthChartDeletePopupComponent
    ],
    entryComponents: [HealthChartComponent, HealthChartUpdateComponent, HealthChartDeleteDialogComponent, HealthChartDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicJhipsterHealthChartModule {}
