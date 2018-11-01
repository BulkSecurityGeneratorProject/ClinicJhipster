import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IHealthChart } from 'app/shared/model/health-chart.model';
import { HealthChartService } from './health-chart.service';
import { IPatient } from 'app/shared/model/patient.model';
import { PatientService } from 'app/entities/patient';

@Component({
    selector: 'jhi-health-chart-update',
    templateUrl: './health-chart-update.component.html'
})
export class HealthChartUpdateComponent implements OnInit {
    healthChart: IHealthChart;
    isSaving: boolean;

    patients: IPatient[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private healthChartService: HealthChartService,
        private patientService: PatientService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ healthChart }) => {
            this.healthChart = healthChart;
        });
        this.patientService.query().subscribe(
            (res: HttpResponse<IPatient[]>) => {
                this.patients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.healthChart.id !== undefined) {
            this.subscribeToSaveResponse(this.healthChartService.update(this.healthChart));
        } else {
            this.subscribeToSaveResponse(this.healthChartService.create(this.healthChart));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IHealthChart>>) {
        result.subscribe((res: HttpResponse<IHealthChart>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackPatientById(index: number, item: IPatient) {
        return item.id;
    }
}
