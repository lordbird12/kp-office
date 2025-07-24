import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { AnalyticsService } from '../dashboards/analytics/analytics.service';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class Service {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    create(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/product_attribute_trans', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/product_attribute_trans/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }



    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/product_attribute_trans/' + id,
            { headers: this.httpOptionsFormdata.headers }
        );
    }

    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/product_attribute_trans/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getJobs(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_jobs')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getByIdJob(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/jobs/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getProductAttribute(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_attribute_all')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getWorkType(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_work_type')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    
    getAllTrans(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_attribute_trans')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    updateStatus(data: any, Id: number): Observable<any> {
        return this._httpClient.put<any>(
            environment.baseURL + '/api/update_status_product_attribute_trans/' + Id,
            data,
            this.httpOptionsFormdata
        );
    }


    /**
     * Get products
     *
     *
     * @param page
     * @param perPage
     * @param sortBy
     * @param order
     * @param search
     */

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/product_attribute_trans_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

}
