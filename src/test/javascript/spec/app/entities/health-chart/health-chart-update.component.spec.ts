/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ClinicJhipsterTestModule } from '../../../test.module';
import { HealthChartUpdateComponent } from 'app/entities/health-chart/health-chart-update.component';
import { HealthChartService } from 'app/entities/health-chart/health-chart.service';
import { HealthChart } from 'app/shared/model/health-chart.model';

describe('Component Tests', () => {
    describe('HealthChart Management Update Component', () => {
        let comp: HealthChartUpdateComponent;
        let fixture: ComponentFixture<HealthChartUpdateComponent>;
        let service: HealthChartService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClinicJhipsterTestModule],
                declarations: [HealthChartUpdateComponent]
            })
                .overrideTemplate(HealthChartUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(HealthChartUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HealthChartService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new HealthChart(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.healthChart = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new HealthChart();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.healthChart = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
