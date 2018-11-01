import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IHealthChart } from 'app/shared/model/health-chart.model';
import { HealthChartService } from './health-chart.service';

@Component({
    selector: 'jhi-health-chart-delete-dialog',
    templateUrl: './health-chart-delete-dialog.component.html'
})
export class HealthChartDeleteDialogComponent {
    healthChart: IHealthChart;

    constructor(
        private healthChartService: HealthChartService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.healthChartService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'healthChartListModification',
                content: 'Deleted an healthChart'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-health-chart-delete-popup',
    template: ''
})
export class HealthChartDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ healthChart }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(HealthChartDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.healthChart = healthChart;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
