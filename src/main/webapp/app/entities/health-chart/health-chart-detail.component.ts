import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHealthChart } from 'app/shared/model/health-chart.model';

@Component({
    selector: 'jhi-health-chart-detail',
    templateUrl: './health-chart-detail.component.html'
})
export class HealthChartDetailComponent implements OnInit {
    healthChart: IHealthChart;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ healthChart }) => {
            this.healthChart = healthChart;
        });
    }

    previousState() {
        window.history.back();
    }
}
