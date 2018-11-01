import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IHealthChart } from 'app/shared/model/health-chart.model';

type EntityResponseType = HttpResponse<IHealthChart>;
type EntityArrayResponseType = HttpResponse<IHealthChart[]>;

@Injectable({ providedIn: 'root' })
export class HealthChartService {
    public resourceUrl = SERVER_API_URL + 'api/health-charts';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/health-charts';

    constructor(private http: HttpClient) {}

    create(healthChart: IHealthChart): Observable<EntityResponseType> {
        return this.http.post<IHealthChart>(this.resourceUrl, healthChart, { observe: 'response' });
    }

    update(healthChart: IHealthChart): Observable<EntityResponseType> {
        return this.http.put<IHealthChart>(this.resourceUrl, healthChart, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IHealthChart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IHealthChart[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IHealthChart[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
