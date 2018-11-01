/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClinicJhipsterTestModule } from '../../../test.module';
import { HealthChartDetailComponent } from 'app/entities/health-chart/health-chart-detail.component';
import { HealthChart } from 'app/shared/model/health-chart.model';

describe('Component Tests', () => {
    describe('HealthChart Management Detail Component', () => {
        let comp: HealthChartDetailComponent;
        let fixture: ComponentFixture<HealthChartDetailComponent>;
        const route = ({ data: of({ healthChart: new HealthChart(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClinicJhipsterTestModule],
                declarations: [HealthChartDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(HealthChartDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(HealthChartDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.healthChart).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
