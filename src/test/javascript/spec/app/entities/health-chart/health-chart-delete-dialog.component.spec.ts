/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ClinicJhipsterTestModule } from '../../../test.module';
import { HealthChartDeleteDialogComponent } from 'app/entities/health-chart/health-chart-delete-dialog.component';
import { HealthChartService } from 'app/entities/health-chart/health-chart.service';

describe('Component Tests', () => {
    describe('HealthChart Management Delete Component', () => {
        let comp: HealthChartDeleteDialogComponent;
        let fixture: ComponentFixture<HealthChartDeleteDialogComponent>;
        let service: HealthChartService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClinicJhipsterTestModule],
                declarations: [HealthChartDeleteDialogComponent]
            })
                .overrideTemplate(HealthChartDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(HealthChartDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HealthChartService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
