import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IHealthChart } from 'app/shared/model/health-chart.model';
import { Principal } from 'app/core';
import { HealthChartService } from './health-chart.service';

@Component({
    selector: 'jhi-health-chart',
    templateUrl: './health-chart.component.html'
})
export class HealthChartComponent implements OnInit, OnDestroy {
    healthCharts: IHealthChart[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private healthChartService: HealthChartService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.healthChartService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<IHealthChart[]>) => (this.healthCharts = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.healthChartService.query().subscribe(
            (res: HttpResponse<IHealthChart[]>) => {
                this.healthCharts = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInHealthCharts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IHealthChart) {
        return item.id;
    }

    registerChangeInHealthCharts() {
        this.eventSubscriber = this.eventManager.subscribe('healthChartListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
