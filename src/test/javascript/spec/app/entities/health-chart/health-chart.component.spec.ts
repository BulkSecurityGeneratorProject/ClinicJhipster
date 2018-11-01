/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ClinicJhipsterTestModule } from '../../../test.module';
import { HealthChartComponent } from 'app/entities/health-chart/health-chart.component';
import { HealthChartService } from 'app/entities/health-chart/health-chart.service';
import { HealthChart } from 'app/shared/model/health-chart.model';

describe('Component Tests', () => {
    describe('HealthChart Management Component', () => {
        let comp: HealthChartComponent;
        let fixture: ComponentFixture<HealthChartComponent>;
        let service: HealthChartService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClinicJhipsterTestModule],
                declarations: [HealthChartComponent],
                providers: []
            })
                .overrideTemplate(HealthChartComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(HealthChartComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HealthChartService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new HealthChart(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.healthCharts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
