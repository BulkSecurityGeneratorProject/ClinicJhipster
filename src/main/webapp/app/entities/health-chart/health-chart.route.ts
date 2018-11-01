import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HealthChart } from 'app/shared/model/health-chart.model';
import { HealthChartService } from './health-chart.service';
import { HealthChartComponent } from './health-chart.component';
import { HealthChartDetailComponent } from './health-chart-detail.component';
import { HealthChartUpdateComponent } from './health-chart-update.component';
import { HealthChartDeletePopupComponent } from './health-chart-delete-dialog.component';
import { IHealthChart } from 'app/shared/model/health-chart.model';

@Injectable({ providedIn: 'root' })
export class HealthChartResolve implements Resolve<IHealthChart> {
    constructor(private service: HealthChartService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((healthChart: HttpResponse<HealthChart>) => healthChart.body));
        }
        return of(new HealthChart());
    }
}

export const healthChartRoute: Routes = [
    {
        path: 'health-chart',
        component: HealthChartComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'HealthCharts'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'health-chart/:id/view',
        component: HealthChartDetailComponent,
        resolve: {
            healthChart: HealthChartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'HealthCharts'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'health-chart/new',
        component: HealthChartUpdateComponent,
        resolve: {
            healthChart: HealthChartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'HealthCharts'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'health-chart/:id/edit',
        component: HealthChartUpdateComponent,
        resolve: {
            healthChart: HealthChartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'HealthCharts'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const healthChartPopupRoute: Routes = [
    {
        path: 'health-chart/:id/delete',
        component: HealthChartDeletePopupComponent,
        resolve: {
            healthChart: HealthChartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'HealthCharts'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
